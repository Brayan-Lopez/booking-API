const { 
  getAll, create, getOne, remove, update, login
} = require('../controllers/user.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT');

const userRouter = express.Router();

userRouter.route('/users/login')
  .post(login)

userRouter.route('/users')
  .get(verifyJWT, getAll)
  .post(create)
  
userRouter.route('/users/:id')
  .get(verifyJWT, getOne)
  .put(verifyJWT, update)
  .delete(verifyJWT, remove)


module.exports = userRouter;