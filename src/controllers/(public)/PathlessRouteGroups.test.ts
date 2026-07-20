import { describe, it, type TestContext } from 'node:test';
import { getTestServerURL } from '@adaptivestone/framework/tests/testHelpers.js';

describe('pathless controller route groups', () => {
  it('keeps parenthesized folders out of the public URL', async (t: TestContext) => {
    t.plan(3);

    const response = await fetch(getTestServerURL('/pathlessroutegroups'));
    t.assert.strictEqual(response.status, 200);
    t.assert.deepStrictEqual(await response.json(), {
      data: [{ convention: 'pathless-route-group-directories' }],
      pagination: { page: 1, limit: 10, skip: 0 },
      filters: { changedAfter: null },
    });

    const physicalPath = await fetch(
      getTestServerURL('/(public)/pathlessroutegroups'),
    );
    t.assert.strictEqual(physicalPath.status, 404);
  });
});
