import { describe, it, type TestContext } from 'node:test';
import { getTestServerURL } from '@adaptivestone/framework/tests/testHelpers.js';

// `/health` is registered by the `bootHttp` hook, not by a controller, so it
// exists under test only because `src/tests/configureServer.ts` hands the test
// server the same hook `server.ts` hands production. Without that wiring this
// request would hit the framework's 404 sink.
describe('GET /health', () => {
  it('answers from the route the bootHttp hook registered', async (t: TestContext) => {
    t.plan(2);
    const res = await fetch(getTestServerURL('/health'));
    const body = await res.json();

    t.assert.strictEqual(res.status, 200);
    t.assert.deepStrictEqual(body, { data: { status: 'ok' } });
  });
});
