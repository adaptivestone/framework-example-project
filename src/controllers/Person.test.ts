import { describe, it, type TestContext } from 'node:test';
import { getTestServerURL } from '@adaptivestone/framework/tests/testHelpers.js';

describe('create', () => {
  it('creates a person', async (t: TestContext) => {
    t.plan(2);
    const res = await fetch(getTestServerURL('/person'));
    const body = await res.json();
    t.assert.strictEqual(res.status, 200);
    t.assert.strictEqual(body.data.lastName, 'Snow');
  });
});

// Both handlers return `HttpResponse.json(status, body)`: the status and the
// `{ data }` envelope a client sees are exactly what the handler returned.
describe('POST /person → GET /person/:id', () => {
  it('creates a person with 201 and reads the same document back with 200', async (t: TestContext) => {
    t.plan(4);
    const created = await fetch(getTestServerURL('/person'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'Arya', lastName: 'Stark' }),
    });
    const createdBody = await created.json();
    t.assert.strictEqual(created.status, 201);
    t.assert.deepStrictEqual(
      [createdBody.data.firstName, createdBody.data.lastName],
      ['Arya', 'Stark'],
    );

    const fetched = await fetch(
      getTestServerURL(`/person/${createdBody.data._id}`),
    );
    t.assert.strictEqual(fetched.status, 200);
    t.assert.deepStrictEqual(await fetched.json(), createdBody);
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
    t.plan(2);
    const res = await fetch(
      getTestServerURL('/person/507f1f77bcf86cd799439011'),
    );
    t.assert.strictEqual(res.status, 404);
    t.assert.deepStrictEqual(await res.json(), {
      error: 'PERSON_NOT_FOUND',
      message: 'Person not found',
    });
  });
});
