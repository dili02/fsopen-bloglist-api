const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middlewares')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1
    })

  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const { token } = request

  if (!title || !url) {
    return response.status(400).end()
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const user = await User.findById(decodedToken.id)

  const newBlog = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id
  })

  const savedBlog = await newBlog.save()

  user.blogs = user.blogs.concat(savedBlog.id)

  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  const { token } = request

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const blog = await Blog.findById(id)

  if (blog.user.toString() !== decodedToken.id.toString()) {
    response
      .status(400)
      .json({
        error: 'invalid credentials to delete this blog'
      })
  }

  await Blog.findByIdAndRemove(id)

  response
    .status(204)
    .end()
})

blogRouter.put('/:id', userExtractor, async (request, response) => {
  const { likes } = request.body
  const { id } = request.params
  const { user, token } = request

  if (!token || !user) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const blog = await Blog.findById(id)

  if (blog.user.toString() !== user.id.toString()) {
    response
      .status(400)
      .json({
        error: 'invalid credentials to delete this blog'
      })
  }

  const blogToUpdate = {
    likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    blogToUpdate,
    { new: true }
  )

  response.json(updatedBlog)
})

module.exports = blogRouter
