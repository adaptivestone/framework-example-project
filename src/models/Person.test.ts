import { appInstance } from '@adaptivestone/framework/helpers/appInstance.js';
import { describe, expect, it } from 'vitest';

describe('person', () => {
  it('sample person test', async () => {
    expect.assertions(4);
    const Person = await appInstance.getModel('Person');
    const doc = await Person.create({
      firstName: 'Jon',
      lastName: 'Snow',
    });
    expect(doc.fullName).toBe('Jon Snow');

    doc.fullName = 'Jon Stark';
    expect(doc.firstName).toBe('Jon');
    expect(doc.lastName).toBe('Stark');

    const doc2 = await Person.findByFullName('Jon Snow');

    expect(doc2?.lastName).toBe('Snow');
  });
});
