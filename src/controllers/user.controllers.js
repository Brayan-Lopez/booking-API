const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const getAll = catchError(async(req, res) => {
    const users = await User.findAll();
    return res.json(users);
});

const create = catchError(async(req, res) => {
  const {firstName,lastName,email,password,gender} = req.body
  const encriptedPasword = await bcrypt.hash(password, 10)
    const user = await User.create({
      firstName, lastName, email, password:encriptedPasword, gender
    });
    return res.status(201).json(user);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if(!user) return res.sendStatus(404);
    return res.json(user);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
  const {firstName,lastName,email,gender} = req.body
  const { id } = req.params;
  const user = await User.update(
      {
        firstName,lastName,email,gender
      },
      { where: {id}, returning: true }
  );
  if(user[0] === 0) return res.sendStatus(404);
  return res.json(user[1][0]);
});

const login = catchError(async(req, res)=>{
  const {email, password} = req.body
  const user = await User.findOne({where:{email}})
  if(!user) return res.status(401).json({message:'invalid credentials'})
  const validPassword = await bcrypt.compare(password, user.password)
  if(!validPassword) return res.status(401).json({message: 'invalid credentials'})
  const token = jwt.sign(
    {user},
    process.env.TOKEN_SECRET,
    {expiresIn: '1d'}
  )
  return res.json({user, token})
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login
}