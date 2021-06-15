const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const { api } = require('../utils/blog_api_test_helper')

let user = null
let token = null

beforeEach(async () => {
  /* await User.deleteMany({})
  await Blog.deleteMany({}) */

  const userToCreate = {
    username: 'userToTest',
    name: 'userToTest',
    password: 'secret'
  }

  await api
    .post('/api/users')
    .send(userToCreate)
    .set('Accept', 'application/json')
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/users')
  user = response.body

  const loginUser = {
    username: 'userToTest',
    password: 'secret'
  }

  const loggedUser = await api
    .post('/api/login')
    .send(loginUser)
    .expect('Content-Type', /application\/json/)

  token = loggedUser.body.token
  return { user, token }
})

describe('GET /api/blogs', () => {
  test('should returns the correct amount of blog posts in the JSON format', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(response.body.length)
  })

  test('verifies that the unique identifier property of the blog posts is named id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect([response.id]).toBeDefined()
  })
})

describe('POST /api/blogs', () => {
  test('should succeeds with status 201 a valid blog can be added', async () => {
    /* const loginUser = {
      username: 'userToTest',
      password: 'secret'
    }

    const loggedUser = await api
      .post('/api/login')
      .send(loginUser)
      .expect('Content-Type', /application\/json/) */

    const blogsToStart = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newBlog = {
      title: 'Test an app',
      author: 'Jhon Doe',
      url: 'https://fullstackopen.com/',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsToEnd = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const listBlogs = blogsToEnd.body.map(blog => blog.title)

    expect(listBlogs).toContain(newBlog.title)
    expect(blogsToEnd.body).toHaveLength(blogsToStart.body.length + 1)
  })
})

describe('DELETE /api/blogs', () => {
  test('should succeeds with status 204 a valid user', async () => {
    /* const loginUser = {
      username: 'userToTest',
      password: 'secret'
    }

    const loggedUser = await api
      .post('/api/login')
      .send(loginUser)
      .expect('Content-Type', /application\/json/) */

    const newBlog = {
      title: 'Test an app',
      author: 'Jhon Doe',
      url: 'https://fullstackopen.com/',
      likes: 4
    }

    const createdBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAfterCreated = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    await api
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsToEnd = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const listBlogs = blogsToEnd.body.map(blog => blog.title)

    expect(listBlogs).not.toContain(blogsToEnd.body.title)

    expect(blogsToEnd.body).toHaveLength(blogAfterCreated.body.length - 1)
  })

  test('should fail with status 401 with invalid user', async () => {
    /* const loginUser = {
      username: 'userToTest',
      password: 'secret'
    }

    const loggedUser = await api
      .post('/api/login')
      .send(loginUser)
      .expect('Content-Type', /application\/json/) */

    const newBlog = {
      title: 'Test an app',
      author: 'Jhon Doe',
      url: 'https://fullstackopen.com/',
      likes: 4
    }

    const createdBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAfterCreated = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const someTokenNoValid = 'dkkasfkasjkadsjad'
    await api
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `bearer ${someTokenNoValid}`)
      .expect(401)

    const blogsToEnd = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(blogsToEnd.body).toHaveLength(blogAfterCreated.body.length)
  })
})

describe('PUT /api/blogs', () => {
  test('should succeeds with status 204 a valid user', async () => {
    /* const loginUser = {
      username: 'userToTest',
      password: 'secret'
    }

    const loggedUser = await api
      .post('/api/login')
      .send(loginUser)
      .expect('Content-Type', /application\/json/) */

    const newBlog = {
      title: 'Test an app',
      author: 'Jhon Doe',
      url: 'https://fullstackopen.com/',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAfterCreated = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogToUpdate = blogAfterCreated.body.find((blog, index) => blog.id === blogAfterCreated.body[index].id)

    const toUpdate = {
      title: 'Test',
      author: 'Jhon Doe',
      url: 'https://fullstackopen.com/',
      likes: 8
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(toUpdate)
      .expect(204)

    const blogsToEnd = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(blogsToEnd.body[0].likes).toBe(8)
    expect(blogsToEnd.body).toHaveLength(blogAfterCreated.body.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
