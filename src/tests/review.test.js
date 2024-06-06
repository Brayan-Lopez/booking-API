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

test('POST /reviews debe crear una review', async()=>{
  const newReview = {
    rating:"4.5",
    comment:"comment test"
  }
  const res = await request(app).post('/reviews').send(newReview).set("Authorization", `Bearer ${token}`)
  id = res.body.id
  expect(res.status).toBe(201)
  expect(id).toBeDefined()
  expect(res.body.rating).toBe(newReview.rating)
})

test('GET /reviews debe traer todos las reviews', async()=>{
  const res = await request(app).get('/reviews')
  expect(res.status).toBe(200)
  expect(res.body).toBeInstanceOf(Array)
})

test('PUT /reviews/:id debe actualizar los datos de una review', async()=>{
  const updatedReview = {
    rating:"3"
  }
  const res = await request(app).put(`/reviews/${id}`).send(updatedReview).set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(200)
  expect(res.body.rating).toBe(updatedReview.rating)
})

test('DELETE /reviews/:id debe borrar una review por medio del id', async()=>{
  const res = await request(app).delete(`/reviews/${id}`).set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(204)
})