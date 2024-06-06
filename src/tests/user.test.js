const request = require('supertest')
const app = require('../app')

let id;
let token;


test('POST /users debe crear un usuario', async()=>{
  const newUser = {
    firstName:"name test",
    lastName:"lastName test",
    email:"testCreate@email.com",
    password:"12345678",
    gender:"other"
  }
  const res = await request(app).post('/users').send(newUser)
  id = res.body.id
  expect(res.status).toBe(201)
  expect(id).toBeDefined()
  expect(res.body.firstName).toBe(newUser.firstName)
})

test('POST /users/login debe logear al usuario', async () => {
  const credentials = {
    email:"testCreate@email.com",
    password:"12345678"
  }
  const res = await request(app).post('/users/login').send(credentials)
  token = res.body.token
  expect(res.status).toBe(200)
  expect(res.body.token).toBeDefined()
  expect(res.body.user.email).toBe(credentials.email)
});

test('POST /users/login con credenciales incorrectas debe dar herror', async () => {
  const credentials = {
        email:"incorrectoCreate@email.com",
        password:"12345678incorrecto"
      }
  const res = await request(app).post('/users/login').send(credentials)
  expect(res.status).toBe(401)
});

test('GET /users debe traer todos los usuarios', async()=>{
  const res = await request(app).get('/users').set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(200)
  expect(res.body).toBeInstanceOf(Array)
})

test('PUT /users/:id debe actualizar los datos de un usuario', async()=>{
  const updatedUser = {
    firstName:"name test updated"
  }
  const res = await request(app).put(`/users/${id}`).send(updatedUser).set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(200)
  expect(res.body.firstName).toBe(updatedUser.firstName)
})

test('DELETE /users/:id debe borrar un usuario por medio del id', async()=>{
  const res = await request(app).delete(`/users/${id}`).set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(204)
})