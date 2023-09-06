import { describe, it, expect } from 'vitest';

describe('create', () => {
  it('creat person', async () => {
    expect.assertions(1);
    const { status } = await fetch(global.server.testingGetUrl('/person'));
    expect(status).toBe(200);
  });
});
