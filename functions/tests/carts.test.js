const request = require("supertest");
const baseURL = "http://localhost:3000";
const superagent = require("superagent").agent();
const pool = require("../db/index");

describe("carts tests", () => {
  let cartId;
  let orderId;

  beforeAll(async () => {
    await superagent
      .post("http://localhost:3000/login")
      .send({ email: "a@a", password: "123" });
  });

  it("gets carts", async () => {
    let response = await superagent.get("http://localhost:3000/api/carts");
    expect(response.status).toBe(200);
    expect(response.body.length > 1).toBe(true);
  });

  it("gets a cart by id", async () => {
    let response = await superagent.get("http://localhost:3000/api/carts/1");
    expect(response.status).toBe(200);
    expect(response.body[0].id).toBe(1);
  });
  //add a test user, and therefore test cart for the purposes of these cart tests
  it("creates a test user", async () => {
    let response = await request(baseURL)
      .post("/register")
      .send({ email: "cartstest@jest.com", password: "test" });
    expect(response.status).toBe(302);
  });

  it("finds test users id, set cart_id equal to it", async () => {
    let response = await superagent.get(
      "http://localhost:3000/api/users/cartstest@jest.com"
    );
    expect(response.status).toBe(200);
    expect(response.body[0].id).not.toBe(null);
    cartId = response.body[0].id;
  });

  it("adds a product to test users cart", async () => {
    let response = await superagent.post(
      `http://localhost:3000/api/carts/?cart_id=${cartId}&product_id=1&product_count=3`
    );
    expect(response.status).toBe(201);
    expect(response.body[0].cart_id).toBe(cartId);
    expect(response.body[0].product_id).toBe(1);
    expect(response.body[0].product_count).toBe(3);
  });

  it("adds one of a product to the cart", async () => {
    let response = await superagent.put(
      `http://localhost:3000/api/carts/plusone/?cart_id=${cartId}&product_id=1`
    );
    expect(response.status).toBe(200);
    expect(response.body[0].product_count).toBe(4);
  });

  it("subtracts one of a product from the cart", async () => {
    let response = await superagent.put(
      `http://localhost:3000/api/carts/minusone/?cart_id=${cartId}&product_id=1`
    );
    expect(response.status).toBe(200);
    expect(response.body[0].product_count).toBe(3);
  });

  it("checks out users cart and creates order", async () => {
    let response = await superagent.post(
      `http://localhost:3000/api/carts/checkout/${cartId}`
    );
    expect(response.status).toBe(200);
    expect(response.body.length > 0).toBe(true);
    expect(response.body[0].product_id).toBe(1);
    expect(response.body[0].product_count).toBe(3);
    orderId = response.body[0].order_id;
  });

  it("deletes the test user and associated rows (orders_products, orders, carts_products)", async () => {
     await pool.query(`DELETE FROM orders_products WHERE order_id = $1`, [orderId]);
     await pool.query(`DELETE FROM orders WHERE id = $1`,[orderId]);
    let response = await superagent.delete("http://localhost:3000/api/users/cartstest@jest.com")
    expect(response.status).toBe(200)
    expect(response.text).toBe("User with the email: cartstest@jest.com deleted")
  });
});
