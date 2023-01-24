const request = require("supertest");
const baseURL = "http://localhost:3000";
const superagent = require("superagent").agent();


describe("/api/users tests", () =>{
    beforeAll(async () =>{
        await superagent
        .post("http://localhost:3000/login")
        .send({ email: "a@a", password: "123" });
    });
    
    it("gets users", async () => {
        let response = await superagent.get('http://localhost:3000/api/users')
        expect(response.status).toBe(200)
        expect(response.text.length > 1).toBe(true)
    })

    it("gets user by email", async() => {
        let response = await superagent.get('http://localhost:3000/api/users/a@a')
        expect(response.status).toBe(200)
        expect(response.body[0].email).toBe('a@a')
    })

    it('updates a users info', async() => {
        let response = await superagent.put('http://localhost:3000/api/users/a@a')
        .send( {
            "first_name": "supertest",
            "last_name": "put",
            "address": "123 jest street",
            "province_state": "ST",
            "country": "TS",
            "city": "Supertestville"
        })

        expect(response.status).toBe(200)
        expect(response.body[0].first_name).toBe('supertest')
        expect(response.body[0].last_name).toBe('put')
        expect(response.body[0].address).toBe('123 jest street')
        expect(response.body[0].province_state).toBe('ST')
        expect(response.body[0].country).toBe('TS')
        expect(response.body[0].city).toBe('Supertestville')
        
    })
})