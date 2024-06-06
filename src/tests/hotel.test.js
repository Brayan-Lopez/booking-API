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

test('POST /hotels debe crear un hotel', async()=>{
  const newHotel = {
    name:"name test",
    description:"description by hotel test",
    price:70.2,
    address:"address test",
    lat:1.2,
    lon:2.2
  }
  const res = await request(app).post('/hotels').send(newHotel).set("Authorization", `Bearer ${token}`)
  id = res.body.id
  expect(res.status).toBe(201)
  expect(id).toBeDefined()
  expect(res.body.name).toBe(newHotel.name)
})

test('GET /hotels debe traer todos los hoteles', async()=>{
  const res = await request(app).get('/hotels')
  expect(res.status).toBe(200)
  expect(res.body).toBeInstanceOf(Array)
})

test('PUT /hotels/:id debe actualizar los datos de un usuario', async()=>{
  const updatedHotel = {
    name:"name test updated"
  }
  const res = await request(app).put(`/hotels/${id}`).send(updatedHotel).set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(200)
  expect(res.body.name).toBe(updatedHotel.name)
})

test('DELETE /hotels/:id debe borrar un hotel por medio del id', async()=>{
  const res = await request(app).delete(`/hotels/${id}`).set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(204)
})