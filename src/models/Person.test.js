import { describe, it, expect } from 'vitest';

describe('person', () => {
  it('sample person test', async () => {
    expect.assertions(4);
    const Person = await global.server.app.getModel('Person');
    let doc = await Person.create({
      firstName: 'Jon',
      lastName: 'Snow',
    });
    expect(doc.fullName).toBe('Jon Snow');

    doc.fullName = 'Jon Stark';
    expect(doc.firstName).toBe('Jon');
    expect(doc.lastName).toBe('Stark');

    doc = await Person.findByFullName('Jon Snow');

    expect(doc.lastName).toBe('Snow');
  });
});
