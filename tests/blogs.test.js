const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { initialBlogs, getAllBlogs } = require('../utils/blog_api_test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('GET ALL BLOGS', () => {
  test('returns the correct amount of blog posts in the JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('verifies that the unique identifier property of the blog posts is named id', async () => {
    const response = await getAllBlogs()
    expect([response.id]).toBeDefined()
  })
})

describe('POST CREATE A NEW BLOG', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Loopy',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2020/09/30/loopy.html',
      likes: 8
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await getAllBlogs()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

    const contents = blogsAtEnd.map(blog => blog.title)
    expect(contents).toContain(newBlog.title)
  })

  test('verifies that if the likes property is missing from the request, it will default to the value 0', async () => {
    const newBlog = {
      title: 'Example Blog Title',
      author: 'John Doe',
      url: 'http://www.example.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await getAllBlogs()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
    const likes = blogsAtEnd.map(blog => blog.likes)
    expect(likes[initialBlogs.length]).toBe(0)
  })

  test('verifies that if the title property is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
    const newBlog = {
      author: 'John Doe',
      url: 'http://www.example.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await getAllBlogs()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('verifies that if the url property is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
    const newBlog = {
      title: 'Example Blog Title missing url property',
      author: 'John Doe'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await getAllBlogs()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })
})

describe('DELETIN A SINGLE BLOG POST RESOURCE', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await getAllBlogs()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await getAllBlogs()

    expect(blogsAtEnd).toHaveLength(
      initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(blog => blog.title)

    expect(contents).not.toContain(blogToDelete.title)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)

    const blogsAtEnd = await getAllBlogs()

    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })
})

describe('UPDATING THE INFORMATION OF AN INDIVIDUAL BLOG POST', () => {
  test('succeeds with status code 200 if the blog is updated', async () => {
    const blogsAtStart = await getAllBlogs()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes = 21

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await getAllBlogs()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)

    const likes = blogsAtEnd.map(blog => blog.likes)
    expect(likes).toContain(blogToUpdate.likes)
  })
  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .put(`/api/blogs/${invalidId}`)
      .expect(400)

    const blogsAtEnd = await getAllBlogs()

    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})

/*

test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })

*/

/* for (const blog of initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  } */
