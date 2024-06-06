const sequelize = require('../utils/connection');
const request = require('supertest')
const app = require('../app')

const main = async() => {
  try{
    // Acciones a ejecutar antes de los tests
    sequelize.sync();

    const userTests = {
      firstName:"name test",
      lastName:"lastName test",
      email:"test@email.com",
      password:"12345678",
      gender:"other"
    }

    await request(app).post('/users').send(userTests)
    
    process.exit();
  } catch(error){
      console.log(error);
  }
}

main();