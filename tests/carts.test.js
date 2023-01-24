const request = require("supertest");
const baseURL = "http://localhost:3000";
const superagent = require("superagent").agent();

describe("carts tests", () => {
    let cartId;

  beforeAll(async () => {
    await superagent
      .post("http://localhost:3000/login")
      .send({ email: "a@a", password: "123" });
  });

  it("gets carts", async () => {
    let response = await superagent.get("http://localhost:3000/api/carts")
    expect(response.status).toBe(200);
    expect(response.body.length > 1).toBe(true)
  });

  it("gets a cart by id", async () => {
    let response = await superagent.get("http://localhost:3000/api/carts/1")
    expect(response.status).toBe(200);
    expect(response.body[0].id).toBe(1)
  });
  //add a test user, and therefore test cart for the purposes of these cart tests
  it("creates a test user", async () => {
    let response = await request(baseURL).post('/register').send({email: 'registertest@jest.com', password: 'test'})
    expect(response.status).toBe(302)
  });
})