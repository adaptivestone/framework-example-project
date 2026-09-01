// Bun-only test preload — `npm test` (Node) does not use this file.
//
// `node --test` awaits the root-level `before()` hooks a `--import` preload
// registered before it runs the first test in a file. `bun test` does not: the
// first test starts while the shared server boot those hooks kicked off is
// still in flight, so the first HTTP request goes to the not-yet-assigned
// random port (`http://127.0.0.1:0/...`) and fails with ECONNREFUSED, while
// every later test in the same file passes.
//
// Awaiting the same idempotent readiness gate here, at preload evaluation time,
// closes that window. The root hooks then resolve immediately on the promise
// created here, so there is still exactly one server per test file.
//
// It also fixes the position of `configureTestServer`: a preload that awaits at
// top level cannot declare test-server options after that await, because the
// boot has already consumed them. This project therefore declares them in
// `./configureServer.ts`, which `./setupNodeTest.ts` imports first — above the
// await below, and equally valid under Node.
import './setupNodeTest.ts';
import { ensureTestServerReady } from '@adaptivestone/framework/tests/testHelpers.js';

await ensureTestServerReady();
