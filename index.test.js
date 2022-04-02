const app = require("./index");
const request = require("supertest");

describe("User router testing", () => {
    describe("Register", () => {
        describe("New username & password", () => {
            it('returns status 201', async () => {
                const res = await request(app).post('/api/user/register').send({ username: 'hello', password: 'hello' })
                expect(res.statusCode).toEqual(201)
            })
        })
        describe("Existing username & password", () => {
            it('returns status 401', async () => {
                const res = await request(app).post('/api/user/register').send({ username: 'hello', password: 'hello' })
                expect(res.statusCode).toEqual(401)
            })
        })
    })
    describe("Login", () => {
        describe("Correct username & password", () => {
            it('returns status 200', async () => {
                const res = await request(app).post('/api/user/login').send({ username: 'ichsan', password: 'ichsan' })
                expect(res.statusCode).toEqual(200)
            })
        })
        describe("Correct username, but not password", () => {
            it('returns status 401', async () => {
                const res = await request(app).post('/api/user/login').send({ username: 'ichsan', password: 'asdf' })
                expect(res.statusCode).toEqual(401)
            })
        })
        describe("Correct password, but not username", () => {
            it('returns status 401', async () => {
                const res = await request(app).post('/api/user/login').send({ username: 'asf', password: 'ichsan' })
                expect(res.statusCode).toEqual(401)
            })
        })
        describe("Incorrect username & password", () => {
            it('returns status 401', async () => {
                const res = await request(app).post('/api/user/login').send({ username: 'asf', password: 'dfg' })
                expect(res.statusCode).toEqual(401)
            })
        })
    })
    
})