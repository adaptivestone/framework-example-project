import { getTestServerURL } from '@adaptivestone/framework/tests/testHelpers.js';
import { describe, expect, it } from 'vitest';

describe('create', () => {
  it('creat person', async () => {
    expect.assertions(1);
    const { status } = await fetch(getTestServerURL('/person'));
    expect(status).toBe(200);
  });
});
