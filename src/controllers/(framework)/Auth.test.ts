import { describe, it, type TestContext } from 'node:test';
import { getTestServerURL } from '@adaptivestone/framework/tests/testHelpers.js';

describe('grouped framework controller overrides', () => {
  it('keeps inherited Auth routes at /auth', async (t: TestContext) => {
    t.plan(2);

    const authRoute = await fetch(getTestServerURL('/auth/login'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    t.assert.strictEqual(authRoute.status, 400);

    const physicalPath = await fetch(
      getTestServerURL('/(framework)/auth/login'),
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      },
    );
    t.assert.strictEqual(physicalPath.status, 404);
  });
});
