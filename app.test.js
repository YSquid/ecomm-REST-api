const request = require("supertest");
const baseURL = "http://localhost:3000";
var server = request.agent('http://localhost:3000');
const superagent = require('superagent').agent()

//Homepage testing

// describe("Homepage Tests /", () => {
//   it("GET '/' should return 200 status and Hi {name}", async () => {
//     const response = await request(baseURL).get("/");
//     expect(response.statusCode).toBe(200);
//     expect(response.text).toBe("<h1>Hi Ahmad</h1>");
//   });
// });

// //Registration Tests

// describe("Registration Tests", () => {
//   describe("Registration Page Render", () => {
//     it("GET '/register' should return 200 status and register page", async () => {
//       const response = await request(baseURL).get("/register");
//       expect(response.statusCode).toBe(200);
//       expect(response.text).toContain("<h1>Register</h1>");
//     });

//     it("Should log in then delete a user", async () => {});
//   });
// });

// //Login testing
// describe("Login Tests", () => {
//   it("GET '/login' should return 200 status and login page", async () => {
//     const response = await request(baseURL).get("/login");
//     expect(response.statusCode).toBe(200);
//     expect(response.text).toContain("<h1>Login</h1>");
//   });

//   it("POST '/login' should redirect to /api on successful login", async () => {
//     await request(baseURL)
//       .post("/login")
//       .send({
//         email: "a@a",
//         password: "123",
//       })
//       .expect("Location", "/api");
//   });

//   it("POST '/login' should return 'Unauthorized' on unsuccessful login", async () => {
//     const response = await request(baseURL).post("/login").send({
//       email: "a@a",
//       password: "qwe",
//     });
//     expect(response.text).toBe("Unauthorized");
//   });
// });

//Registration testing
describe('Registration tests', () => {
  it('login with superagent', async () =>{

    let loggedIn = await superagent
    .post('http://localhost:3000/login')
    .send({email: 'a@a', password: '123'})
    console.log(loggedIn.text)

    let apiGet = await superagent.get('http://localhost:3000/api')
    console.log(apiGet.text)
    expect(apiGet.status).toBe(200)
    expect(apiGet.text).toBe('Welcome to the API')

  })
})


