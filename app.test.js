const request = require("supertest");
const baseURL = "http://localhost:3000";

//GET homepage route

describe("GET homepage at /", () => {
  it("Should return 200 status", async () => {
    const response = await request(baseURL).get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET login page at /login", () => {
  it("Should return 200 status", async () => {
    const resposne = await request(baseURL).get("/login");
    expect(resposne.statusCode).toBe(200);
  });

  it("Should redirect to /api on successful login", async () => {
    await request(baseURL)
      .post("/login")
      .send({
        email: "a@a",
        password: "123",
      })
      .expect("Location", "/api");
  });

  it("Should show /api text on screen on successful login", async () => {
    const response = await request(baseURL)
    .post('/login')
    .send({
        email: "a@a",
        password: "123",
      })

    expect(response.text).toBe("Found. Redirecting to /api")
    })


//   it("Should redirect to /login on unsuccessful login", async () => {
//     await request(baseURL)
//       .post("/login")
//       .send({
//         email: "a@a",
//         password: "qwe",
//       })
//       .expect("Location", "/login");
//   });
});
