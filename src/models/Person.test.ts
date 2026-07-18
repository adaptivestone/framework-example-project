import { describe, it, type TestContext } from 'node:test';
import { appInstance } from '@adaptivestone/framework/helpers/appInstance.js';

describe('person', () => {
  it('sample person test', async (t: TestContext) => {
    t.plan(4);
    const Person = await appInstance.getModel('Person');
    const doc = await Person.create({
      firstName: 'Jon',
      lastName: 'Snow',
    });
    t.assert.strictEqual(doc.fullName, 'Jon Snow');

    doc.fullName = 'Jon Stark';
    t.assert.strictEqual(doc.firstName, 'Jon');
    t.assert.strictEqual(doc.lastName, 'Stark');

    const doc2 = await Person.findByFullName('Jon Snow');

    t.assert.strictEqual(doc2?.lastName, 'Snow');
  });
});
