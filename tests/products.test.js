const request = require("supertest");
const baseURL = "http://localhost:3000";
const superagent = require("superagent").agent();

describe("products tests", () => {
  let productId;
  beforeAll(async () => {
    await superagent
      .post("http://localhost:3000/login")
      .send({ email: "a@a", password: "123" });
  });


  it("gets products", async () => {
    let response = await superagent.get("http://localhost:3000/api/products");
    expect(response.status).toBe(200);
    expect(response.text.length > 1).toBe(true);
  });

  it("gets product by id", async () => {
    let response = await superagent.get("http://localhost:3000/api/products/1");
    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe("Baseball Bat");
  });

  it("adds a test product", async () => {
    let response = await superagent
      .post("http://localhost:3000/api/products")
      .send({
        name: "A test product",
        description: "A product from my test suite",
        price: 1,
        stock: 2,
      });
    expect(response.status).toBe(201);
    expect(response.body[0].name).toBe("A test product");
    expect(response.body[0].description).toBe("A product from my test suite");
    expect(response.body[0].price).toBe("$1.00");
    expect(response.body[0].stock).toBe(2);
    productId = response.body[0].id
  });

  it("updates the test product", async () => {
    let response = await superagent.put(`http://localhost:3000/api/products/${productId}`)
    .send({
        "name" : "An updated test product",
        "description" : "Test product after update",
        "price" : 10,
        "stock" : 100 
    })

    expect(response.status).toBe(200)
    expect(response.body[0].name).toBe("An updated test product")
    expect(response.body[0].description).toBe("Test product after update")
    expect(response.body[0].price).toBe("$10.00")
    expect(response.body[0].stock).toBe(100)
  });

  it("deletes the test product", async () => {
    let response = await superagent.delete(`http://localhost:3000/api/products/${productId}`)
    expect(response.status).toBe(200)
    expect(response.text).toBe(`Product with id: ${productId} deleted`)
  })
});
