const request = require("supertest");
const baseURL = "http://localhost:3000";

//Homepage testing

describe("Homepage Tests /", () => {
  it("GET '/' should return 200 status", async () => {
    const response = await request(baseURL).get("/");
    expect(response.statusCode).toBe(200);
  });
});


//Registration Testing

// describe("Registration Tests", () => {
//   it("Get '/reg'")
// })

//Login testing
describe("Login Tests", () => {
  it("GET '/login' should return 200 status", async () => {
    const response = await request(baseURL).get("/login");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<h1>Login</h1>')
  });

  it("POST '/login' should redirect to /api on successful login", async () => {
    await request(baseURL)
      .post("/login")
      .send({
        email: "a@a",
        password: "123",
      })
      .expect("Location", "/api");
  });

  it("POST '/login' should return 'Found. Redirecting to /api' on successful login", async () => {
    const response = await request(baseURL)
    .post('/login')
    .send({
        email: "a@a",
        password: "123",
      })

    expect(response.text).toBe("Found. Redirecting to /api")
    })


  it("POST '/login' should return 'Unauthorized' on unsuccessful login", async () => {
    const response = await request(baseURL)
      .post("/login")
      .send({
        email: "a@a",
        password: "qwe",
      })
      expect(response.text).toBe("Unauthorized")
  });
});
