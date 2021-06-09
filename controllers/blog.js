const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    return response.status(400).end()
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes
  })

  const savedBlog = await blog.save()
  response.json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const { id } = request.params

  const blog = {
    likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    blog,
    { new: true }
  )

  response.json(updatedBlog)
})

module.exports = blogRouter
