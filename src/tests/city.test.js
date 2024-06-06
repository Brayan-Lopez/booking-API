const request = require('supertest')
const app = require('../app')

let id;
let token;

beforeAll(async()=>{
  const credentials = {
    email:"test@email.com",
    password:"12345678"
  }
  const res = await request(app).post('/users/login').send(credentials)
  token = res.body.token
})

test('POST /cities debe crear una ciudad', async()=>{
  const newCity = {
    name:"name test",
    country:"country test",
    countryId:"co"
  }
  const res = await request(app).post('/cities').send(newCity).set("Authorization", `Bearer ${token}`)
  id = res.body.id
  expect(res.status).toBe(201)
  expect(id).toBeDefined()
  expect(res.body.name).toBe(newCity.name)
})

test('GET /cities debe traer todos los hoteles', async()=>{
  const res = await request(app).get('/cities')
  expect(res.status).toBe(200)
  expect(res.body).toBeInstanceOf(Array)
})

test('PUT /cities/:id debe actualizar los datos de un usuario', async()=>{
  const updatedCity = {
    name:"name updated"
  }
  const res = await request(app).put(`/cities/${id}`).send(updatedCity).set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(200)
  expect(res.body.name).toBe(updatedCity.name)
})

test('DELETE /cities/:id debe borrar una ciudad por medio del id', async()=>{
  const res = await request(app).delete(`/cities/${id}`).set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(204)
})