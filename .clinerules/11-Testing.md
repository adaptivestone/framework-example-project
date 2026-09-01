# Test Conventions

This project uses Node's built-in test runner with the framework's per-run Mongo
and per-file server lifecycle. Node is the primary runtime; the same suite also
runs under Bun — see [Bun](#bun) below.

## Server readiness

`src/tests/setupNodeTest.ts` preloads the framework lifecycle. Node.js may run
sibling root-level `before()` hooks concurrently, so application setup that
needs framework state must await the shared readiness gate:

```ts
import { ensureTestServerReady } from '@adaptivestone/framework/tests/testHelpers.js';
import { before } from 'node:test';

before(async () => {
  await ensureTestServerReady();
  // Config, models, appInstance, and HTTP are ready here.
});
```

The helper is idempotent and shares one startup promise with the framework
preload. Setup used by only one test file should instead live inside that
file's relevant `describe()`.

## Test-server options (`bootHttp`)

App-wide HTTP wiring lives in [`src/bootHttp.ts`](../src/bootHttp.ts), and the
test server gets the same hook the production server does — otherwise routes
registered there (here, `GET /health`) are simply absent under test and nothing
reports the difference. `src/tests/configureServer.ts` is the whole pattern:

```ts
import { configureTestServer } from '@adaptivestone/framework/tests/testHelpers.js';
import bootHttp from '../bootHttp.ts';

configureTestServer({ bootHttp });
```

Ordering is the only trap. The options are consumed when the framework glue
boots the server — one microtask after the preload graph finishes evaluating —
and a call arriving later throws. Keeping the call in its own module that
`src/tests/setupNodeTest.ts` imports **first** satisfies both runners at once:
it also lands above the top-level `await` in the Bun preload
(`setupBunTest.ts`), after which no declaration is accepted. Drop that import
and `src/bootHttp.test.ts` gets the framework's 404 sink instead of the route.

## Asserting on messages

`src/tests/setup.ts` deliberately leaves `TEST_FOLDER_LOCALES` unset, so this
project's `src/locales` is **not** loaded during an ordinary run. Since
framework 5.4 that splits into two cases, and asserting the wrong one is the
easiest way to write a test that passes today and breaks on the next upgrade:

- **Keys this project authors** (the `validation.*` keys used as Standard Schema
  messages) have no catalog entry and no in-code default, so `t()` returns the
  key itself. Assert the **raw key**.
- **Messages the framework emits** (auth validation, the auth 401, the 404 and
  500 sinks) now travel with their English text as a `defaultValue`, so they
  render as **English sentences** — a raw `auth.emailProvided` can no longer
  appear in a response. Assert the English string, or stick to the status code
  and the `errors` field names.

Prefer status codes and `Object.keys(body.errors)` where the copy itself is not
what is under test — that is what the controller tests here do, and it survives
both kinds of change. A test that needs rendered project copy must set
`TEST_FOLDER_LOCALES` before the framework preload boots the server.

## Assertions and mocks

- `t.plan(n)` tracks `t.assert.*` calls and subtests. It does not track calls
  made through a separately imported `node:assert`; do not mix the two styles
  in a planned test.
- `assert.partialDeepStrictEqual()` uses subset semantics for arrays. Assert
  exact array length separately when extra elements must fail. Use the
  two-argument `assert.rejects(promise, pattern)` form for errors, and compare
  selected Mongoose document fields rather than partially matching the raw
  document object.
- Consecutive `mockImplementationOnce()` calls made before the first invocation
  target the same next call. Pass explicit zero-based `onCall` indices when
  registering a sequence.
- For overloaded TypeScript methods, `mock.calls[n].arguments` may be typed as
  a different overload. Prefer public-result assertions; if argument inspection
  is necessary, keep an `unknown`-first tuple cast local to the assertion.

## Bun

Framework 5.4 certifies Bun >= 1.4 as a second runtime, and this project's suite
passes on it unchanged. Run it in its own container — nothing runs on the host:

```bash
docker compose run --rm backend-bun
```

The service reuses the compose `mongo` service and the `node_modules` the
`backend` service installed; `scripts/bun-test.sh` holds the flag mapping.
Things worth knowing before writing a test that has to pass on both:

- Bun implements the `node:test` **API** but not `node --test`, so none of the
  `npm test` flags carry over: `--import` becomes `--preload`,
  `--test-global-setup` has no equivalent (the script hands Mongo over through
  `TEST_MONGO_URI`), and one-process-per-file comes from `--isolate`.
- `bun test` starts the first test in a file **without awaiting** the root
  `before()` hooks a preload registered. `src/tests/setupBunTest.ts` exists only
  for that: it awaits the same `ensureTestServerReady()` gate at preload
  evaluation time. Without it the first HTTP test in each file hits
  `http://127.0.0.1:0/…` and fails with ECONNREFUSED while the rest pass.
- `mock.module()` (Node's `--experimental-test-module-mocks`) throws
  `ERR_NOT_IMPLEMENTED` on Bun. No test here uses it; if you add one, it has to
  be excluded from the Bun run and named in `scripts/bun-test.sh`.
- `assert.deepStrictEqual` against a Mongoose array fails on Bun — a Mongoose
  array is a `Proxy`, which Bun 1.4 reports as unequal. Spread it first
  (`[...doc.tags]`).

## Coverage

`npm run test:ci` enforces its line, branch, and function thresholds and writes
LCOV output. A below-threshold run exits non-zero even with both configured
reporters; do not lower a threshold merely to make a failing pipeline green.
