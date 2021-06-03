const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('total sum of likes in all of the blog posts', () => {
    const result = listHelper.totalLikes(listHelper.blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('when the list returns a single blog with the maximum amount of likes', () => {
    const result = listHelper.favoriteBlog(listHelper.blogs)

    const expectedResult = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }

    expect(result).toEqual(expectedResult)
  })
})
