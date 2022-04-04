const app = require("./index");
const request = require("supertest");
const Link = require('./models/linkModel')
const User = require('./models/userModel')

beforeAll(async () => {
    const resUser = await request(app).post('/api/user/register').send({ username: 'first', password: 'first' })
    token = resUser.body.data.token
    userId = resUser.body.data.id
    const resLink = await request(app).post('/api/link/add').send({userId: userId,nameLink: 'Test Link',longLink: 'https://longlinkexample.com/resource/hello?name=myname&success=true'}).set('Authorization', `Bearer ${token}`)
    linkId = resLink.body.data._id
});
afterAll(async ()=>{
    await Link.collection.drop()
    await User.collection.drop()
})

describe("Authorization testing", ()=>{
    describe("Get all users", () => {
        it('returns status 200', async () => {
            const res = await request(app).get('/api/user/getuser')
            expect(res.statusCode).toEqual(401)
        })
    })
    describe("Get specific user by id", () => {
        it('returns status 401', async () => {
            const res = await request(app).get(`/api/user/getuser/${userId}`)
            expect(res.statusCode).toEqual(401)
        })
    })
    describe("Add new shortlink", () => {
        it('returns status 401', async () => {
            const res = await request(app).post('/api/link/add').send({userId: userId,nameLink: 'Example Link',longLink: 'https://linkexample.com/home'})
            expect(res.statusCode).toEqual(401)
        })
    })
    describe("Edit existing shortlink", () => {
        it('returns status 401', async () => {
            const res = await request(app).post('/api/link/edit').send({linkId: linkId,nameLink: 'Example Edited Link',longLink: 'https://linkexample.com/home/door'})
            expect(res.statusCode).toEqual(401)
        })
    })
    describe("Delete existing shortlink", () => {
        it('returns status 401', async () => {
            const res = await request(app).post('/api/link/delete').send({linkId: linkId})
            expect(res.statusCode).toEqual(401)
        })
    })
    describe("Get link data by link id", () => {
        it('returns status 401', async () => {
            const res = await request(app).get(`/api/link/get/link/${linkId}`)
            expect(res.statusCode).toEqual(401)
        })
    })
    describe("Get link data by user id", () => {
        it('returns status 401', async () => {
            const res = await request(app).get(`/api/link/get/user/${userId}`)
            expect(res.statusCode).toEqual(401)
        })
    })
})

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
                expect(res.statusCode).toEqual(409)
            })
        })
    })
    describe("Login", () => {
        describe("Correct username & password", () => {
            it('returns status 200', async () => {
                const res = await request(app).post('/api/user/login').send({ username: 'hello', password: 'hello' })
                expect(res.statusCode).toEqual(200)
            })
        })
        describe("Correct username, but not password", () => {
            it('returns status 401', async () => {
                const res = await request(app).post('/api/user/login').send({ username: 'hello', password: 'asdf' })
                expect(res.statusCode).toEqual(401)
            })
        })
        describe("Correct password, but not username", () => {
            it('returns status 401', async () => {
                const res = await request(app).post('/api/user/login').send({ username: 'asf', password: 'hello' })
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
    describe("Get users", () => {
        describe("Get all", () => {
            it('returns status 200', async () => {
                const res = await request(app).get('/api/user/getuser').set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toEqual(200)
            })
        })
        describe("Get by id", () => {
            it('returns status 401', async () => {
                const res = await request(app).get(`/api/user/getuser/${userId}`).set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toEqual(200)
            })
        })
        describe("Get by nonexistent id", () => {
            it('returns status 401', async () => {
                const res = await request(app).get(`/api/user/getuser/${userId}`).set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toEqual(200)
            })
        })
    })
})