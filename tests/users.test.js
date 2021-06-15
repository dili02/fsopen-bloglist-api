const { connection } = require('mongoose')
const { api } = require('../utils/blog_api_test_helper')

const User = require('../models/user')

beforeEach(async () => {
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
})

describe('POST /api/users', () => {
  test('should succeeds with a new username', async () => {
    const usersAtStart = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const userToCreate = {
      username: 'username-1',
      name: 'name-1',
      password: 'secret'
    }

    await api
      .post('/api/users')
      .send(userToCreate)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const listUsers = usersAtEnd.body.map(blog => blog.title)

    expect(listUsers).toContain(userToCreate.username)

    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length + 1)

    /* const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(userToCreate.username) */
  })

  test('should fail with code 400 if username is missing', async () => {
    const usersAtStart = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newUser = {
      name: 'name',
      password: 'secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username is missing or must be at least 3 characters long')

    const usersAtEnd = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length)
  })

  test('should fail with code 400 if username must be at least 3 characters long', async () => {
    const usersAtStart = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newUser = {
      username: 'na',
      name: 'name',
      password: 'secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username is missing or must be at least 3 characters long')

    const usersAtEnd = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length)
  })

  test('should fail with code 400 if name is missing', async () => {
    const usersAtStart = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newUser = {
      username: 'username',
      password: 'secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('name is missing or must be at least 3 characters long')

    const usersAtEnd = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length)
  })

  test('should fail with code 400 if name must be at least 3 characters long', async () => {
    const usersAtStart = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newUser = {
      username: 'username',
      name: 'na',
      password: 'secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('name is missing or must be at least 3 characters long')

    const usersAtEnd = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length)
  })

  test('should fail with code 400 if password is missing', async () => {
    const usersAtStart = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newUser = {
      username: 'username',
      name: 'name'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is missing or must be at least 3 characters long')

    const usersAtEnd = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length)
  })

  test('should fail with code 400 if password must be at least 3 characters long', async () => {
    const usersAtStart = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newUser = {
      username: 'username',
      name: 'name',
      password: 'se'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is missing or must be at least 3 characters long')

    const usersAtEnd = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length)
  })

  test('should fail with code 400 if username already taken', async () => {
    const usersAtStart = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newUser = {
      username: 'userToTest',
      name: 'userToTest',
      password: 'secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username to be unique')

    const usersAtEnd = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length)
  })
})

afterAll(() => {
  connection.close()
})
