const request = require('supertest');

describe('create', () => {
  it('creat person', async () => {
    expect.assertions(1);
    const { status } = await request(global.server.app.httpServer.express).get(
      '/person',
    );
    expect(status).toBe(200);
  });
});
