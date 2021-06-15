const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('note', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1
    })
  res.json(users)
})

userRouter.post('/', async (req, res) => {
  const { body } = req
  const { username, name, password } = body

  if (username === undefined || username.length <= 3) {
    return res.status(400).json({ error: 'username is missing or must be at least 3 characters long' })
  }

  if (name === undefined || name.length <= 3) {
    return res.status(400).json({ error: 'name is missing or must be at least 3 characters long' })
  }

  if (password === undefined || password.length <= 3) {
    return res.status(400).json({ error: 'password is missing or must be at least 3 characters long' })
  }

  const existUser = await User.findOne({ username })
  if (existUser) {
    return res.status(400).json({ error: 'username to be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = user.save()

  res.status(201).json(savedUser)
})

module.exports = userRouter
