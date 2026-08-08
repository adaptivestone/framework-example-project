import { describe, it, type TestContext } from 'node:test';
import { getTestServerURL } from '@adaptivestone/framework/tests/testHelpers.js';

describe('create', () => {
  it('creates a person', async (t: TestContext) => {
    t.plan(1);
    const { status } = await fetch(getTestServerURL('/person'));
    t.assert.strictEqual(status, 200);
  });
});

// The route's `params:` schema separates two failures that used to look alike:
// a malformed id is the client's mistake (400), a well-formed id with no
// matching row is a missing resource (404).
describe('GET /person/:id', () => {
  it('rejects a malformed id with 400 before the handler runs', async (t: TestContext) => {
    t.plan(2);
    const res = await fetch(getTestServerURL('/person/not-an-id'));
    const body = await res.json();
    t.assert.strictEqual(res.status, 400);
    t.assert.deepStrictEqual(Object.keys(body.errors), ['id']);
  });

  it('returns 404 for a well-formed id that does not exist', async (t: TestContext) => {
    t.plan(1);
    const res = await fetch(
      getTestServerURL('/person/507f1f77bcf86cd799439011'),
    );
    t.assert.strictEqual(res.status, 404);
  });
});
