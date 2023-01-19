const request = require("supertest");
const baseURL = "http://localhost:3000";

//Homepage testing

describe("Homepage Tests /", () => {
  it("GET '/' should return 200 status and Hi {name}", async () => {
    const response = await request(baseURL).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("<h1>Hi Ahmad</h1>");
  });
});

//Registration Tests

describe("Registration Tests", () => {
  describe("Registration Page Render", () => {
    it("GET '/register' should return 200 status and register page", async () => {
      const response = await request(baseURL).get("/register");
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain("<h1>Register</h1>");
    });
  });
  describe("Register New User Tests", () => {
    it ("POST 'register' should redirect to /login on successful registration", async () => {
      const response = await request(baseURL)
      .post("/register")
      .send({
        email: 'testsuite5@supertest.com',
        password: 'test'
      })
      expect(response.header.location).toBe('/login')
    })
  })
});

//Login testing
describe("Login Tests", () => {
  it("GET '/login' should return 200 status and login page", async () => {
    const response = await request(baseURL).get("/login");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("<h1>Login</h1>");
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
    const response = await request(baseURL).post("/login").send({
      email: "a@a",
      password: "123",
    });

    expect(response.text).toBe("Found. Redirecting to /api");
  });

  it("POST '/login' should return 'Unauthorized' on unsuccessful login", async () => {
    const response = await request(baseURL).post("/login").send({
      email: "a@a",
      password: "qwe",
    });
    expect(response.text).toBe("Unauthorized");
  });
});
