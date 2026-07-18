import { describe, it, type TestContext } from 'node:test';
import { getTestServerURL } from '@adaptivestone/framework/tests/testHelpers.js';

describe('create', () => {
  it('creates a person', async (t: TestContext) => {
    t.plan(1);
    const { status } = await fetch(getTestServerURL('/person'));
    t.assert.strictEqual(status, 200);
  });
});
