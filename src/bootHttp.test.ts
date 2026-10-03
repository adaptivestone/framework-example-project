import { describe, it, type TestContext } from 'node:test';
import { getTestServerURL } from '@adaptivestone/framework/tests/testHelpers.js';

// `/webhooks/example` is registered by the `bootHttp` hook, not by a
// controller, so it exists under test only because
// `src/tests/configureServer.ts` hands the test server the same hook
// `server.ts` hands production. Without that wiring this request would hit
// the framework's 404 sink.
describe('POST /webhooks/example', () => {
  it('answers from the route the bootHttp hook registered', async (t: TestContext) => {
    t.plan(2);
    const res = await fetch(getTestServerURL('/webhooks/example'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'example' }),
    });
    const body = await res.json();

    t.assert.strictEqual(res.status, 202);
    t.assert.deepStrictEqual(body, { data: { received: true } });
  });
});
