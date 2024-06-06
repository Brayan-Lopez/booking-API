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

test('POST /bookings debe crear un booking', async()=>{
  const newBooking = {
    checkIn:"2024-04-30T00:01:00.000Z",
    checkOut:"2024-05-30T00:01:00.000Z"
  }
  const res = await request(app).post('/bookings').send(newBooking).set("Authorization", `Bearer ${token}`)
  console.log(res.body)
  id = res.body.id
  console.log(res.body)
  expect(res.status).toBe(201)
  expect(id).toBeDefined()
  expect(res.body.checkIn).toBe(newBooking.checkIn)
})

test('GET /bookings debe traer todos los bookings', async()=>{
  const res = await request(app).get('/bookings').set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(200)
  expect(res.body).toBeInstanceOf(Array)
})

test('PUT /bookings/:id debe actualizar un booking por medio del id', async()=>{
  const updatedBooking = {
    checkIn:"2024-05-30T00:01:00.000Z",
  }
  const res = await request(app).put(`/bookings/${id}`).send(updatedBooking).set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(200)
  expect(res.body.checkIn).toBe(updatedBooking.checkIn)
})

test('DELETE /bookings/:id debe borrar una booking por medio del id', async()=>{
  const res = await request(app).delete(`/bookings/${id}`).set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(204)
})