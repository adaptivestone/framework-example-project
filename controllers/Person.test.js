let express;
const request = require("supertest");

beforeAll(() => {
  express = global.server.app.httpServer.express;
});

describe("CREAT", () => {
  test("creat person", async () => {
    return request(express)
      .get("/person")
      .expect(200);
  });

});

