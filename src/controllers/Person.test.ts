import { describe, it, expect } from 'vitest';
import { getTestServerURL } from '@adaptivestone/framework/tests/testHelpers.js';

describe('create', () => {
  it('creat person', async () => {
    expect.assertions(1);
    const { status } = await fetch(getTestServerURL('/person'));
    expect(status).toBe(200);
  });
});
