import { describe, it, type TestContext } from 'node:test';
import { appInstance } from '@adaptivestone/framework/helpers/appInstance.js';

describe('person', () => {
  it('sample person test', async (t: TestContext) => {
    t.plan(5);
    const Person = appInstance.getModel('Person');
    const doc = await Person.create({
      firstName: 'Jon',
      lastName: 'Snow',
    });
    t.assert.strictEqual(doc.fullName, 'Jon Snow');

    doc.fullName = 'Jon Stark';
    t.assert.strictEqual(doc.firstName, 'Jon');
    t.assert.strictEqual(doc.lastName, 'Stark');

    doc.labels.push('example');
    t.assert.deepStrictEqual([...doc.labels], ['example']);

    const doc2 = await Person.findByFullName('Jon Snow');

    t.assert.strictEqual(doc2?.lastName, 'Snow');
  });

  it('looks up a runtime-selected model with a throwing boundary', (t: TestContext) => {
    const modelName: string = 'Person';
    const Person = appInstance.getModelOrThrow(modelName);

    t.assert.strictEqual(Person.modelName, 'Person');
  });
});
