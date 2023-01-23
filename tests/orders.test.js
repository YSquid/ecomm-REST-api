const request = require("supertest");
const baseURL = "http://localhost:3000";
const superagent = require("superagent").agent();

describe("orders tests", () => {
  let orderId;

  beforeAll(async () => {
    await superagent
      .post("http://localhost:3000/login")
      .send({ email: "a@a", password: "123" });
  });

  it("gets orders", async () => {
    let response = await superagent.get("http://localhost:3000/api/orders");
    expect(response.status).toBe(200);
    expect(response.text.length > 1).toBe(true);
  });

  it("gets order by id", async () => {
    let response = await superagent.get("http://localhost:3000/api/orders/1");
    expect(response.status).toBe(200);
    expect(response.body[0].id).toBe(1)
  });

  it("adds an order", async() => {
    let response = await superagent.post("http://localhost:3000/api/orders").send({user_id : 3, add_time: 'Jan 23'})
    expect(response.status).toBe(201)
    expect(response.body[0].user_id).toBe(3)
  })
});
