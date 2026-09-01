#!/usr/bin/env bash
#
# Run this project's test suite under Bun (framework >= 5.4 is certified on
# Bun >= 1.4). Node stays the primary runtime — this is the second one.
#
# Bun implements the `node:test` *API* but not Node's test-runner CLI, so the
# `npm test` flags do not carry over. The mapping:
#
#   node --test                          →  bun test
#   --import=<preload>                   →  --preload <preload>   (plus the
#                                           Bun-only wrapper setupBunTest.ts)
#   --test-global-setup=<module>         →  no equivalent: this script starts
#                                           Mongo and exports TEST_MONGO_URI,
#                                           which the framework bootstrap reads
#   one process per test file            →  --isolate (fresh module registry per
#                                           file, so each file boots its own
#                                           Server exactly as under Node)
#   (no per-test timeout flag)           →  --timeout=10000
#
# `mock.module()` (Node's `--experimental-test-module-mocks`) has no Bun
# equivalent — it throws ERR_NOT_IMPLEMENTED (oven-sh/bun#5090). No test in this
# project uses it, so nothing is excluded from the Bun run.
#
# Mongo: an in-memory replica set is started here unless TEST_MONGO_URI is
# already set — point it at the compose `mongo` service to reuse that instead:
#
#   TEST_MONGO_URI='mongodb://mongo/__DB_TO_REPLACE__?replicaSet=rs0'
#
# The URI must contain `__DB_TO_REPLACE__`; each test file swaps in its own
# database name.
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ Bun $(bun --version)"

MONGO_PID=""
URI_FILE=""
cleanup() {
  # Keep every branch successful: a falsy last command in an EXIT trap would
  # override the exit status `bun test` just produced.
  if [ -n "$MONGO_PID" ]; then
    kill "$MONGO_PID" 2>/dev/null || true
    wait "$MONGO_PID" 2>/dev/null || true
  fi
  if [ -n "$URI_FILE" ]; then
    rm -f "$URI_FILE"
  fi
}
trap cleanup EXIT

if [ -z "${TEST_MONGO_URI:-}" ]; then
  echo "→ Starting an in-memory Mongo replica set (mongodb-memory-server)"
  URI_FILE="$(mktemp)"
  MONGO_URI_FILE="$URI_FILE" bun -e '
    import { writeFileSync } from "node:fs";
    const { MongoMemoryReplSet } = await import("mongodb-memory-server");
    const rs = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: "wiredTiger" },
    });
    await rs.waitUntilRunning();
    writeFileSync(process.env.MONGO_URI_FILE, await rs.getUri("__DB_TO_REPLACE__"));
    const stop = async () => { await rs.stop(); process.exit(0); };
    process.on("SIGTERM", stop);
    process.on("SIGINT", stop);
    setInterval(() => {}, 1 << 30);
  ' &
  MONGO_PID=$!
  for _ in $(seq 1 120); do
    [ -s "$URI_FILE" ] && break
    kill -0 "$MONGO_PID" 2>/dev/null || { echo "✗ Mongo failed to start"; exit 1; }
    sleep 1
  done
  [ -s "$URI_FILE" ] || { echo "✗ Timed out waiting for Mongo"; exit 1; }
  TEST_MONGO_URI="$(cat "$URI_FILE")"
  export TEST_MONGO_URI
fi
echo "  TEST_MONGO_URI=$TEST_MONGO_URI"

export LOGGER_CONSOLE_LEVEL="${LOGGER_CONSOLE_LEVEL:-error}"

echo "→ bun test"
bun test \
  --isolate \
  --timeout=10000 \
  --preload ./src/tests/setupBunTest.ts \
  src/ \
  "$@"
