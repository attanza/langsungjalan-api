'use strict'


const StudyName = use('App/Models/StudyName')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('StudyNames')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endPoint = '/api/v1/study-names'

/**
 * List of StudyName
 */

test('Unathorized cannot get StudyName List', async ({ client }) => {
  const response = await client
    .get(endPoint)
    .end()
  response.assertStatus(401)
})

test('Authorized can get StudyName List', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endPoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Create StudyName
 */

test('Unathorized cannot create StudyName', async ({ client }) => {
  const response = await client
    .post(endPoint)
    .send(StudyNameData())
    .end()
  response.assertStatus(401)
})

test('Non Super Administrator cannot Create StudyName', async ({ client }) => {
  const user = await User.find(2)
  const response = await client
    .post(endPoint)
    .loginVia(user, 'jwt')
    .send(StudyNameData())
    .end()
  response.assertStatus(403)
})

test('Super Administrator can Create StudyName', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endPoint)
    .loginVia(user, 'jwt')
    .send(StudyNameData())
    .end()
  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      name: 'Test Study Name',
    }
  })
})

test('Cannot Create StudyName with uncomplete data', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endPoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update StudyName
 */

test('Unathorized cannot Update StudyName', async ({ client }) => {
  const editing = await StudyName.find(2)
  const response = await client
    .put(endPoint + '/' + editing.id)
    .send(StudyNameData())
    .end()
  response.assertStatus(401)
})

test('Non Superadmin cannot Update StudyName', async ({ client }) => {
  const user = await User.find(2)
  const editing = await StudyName.find(2)
  const response = await client
    .put(endPoint + '/'  + editing.id)
    .loginVia(user, 'jwt')
    .send(StudyNameData())
    .end()
  response.assertStatus(403)
})

test('Superadmin can Update StudyName', async ({ client }) => {
  const user = await User.find(1)
  const editing = await StudyName.find(2)
  const response = await client
    .put(endPoint + '/'  + editing.id)
    .loginVia(user, 'jwt')
    .send(StudyNameData())
    .end()
  response.assertStatus(200)
})

test('Cannot Update unexisted StudyName', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .put(endPoint + '/'  + 35)
    .loginVia(user, 'jwt')
    .send(StudyNameData())
    .end()
  response.assertStatus(400)
})

/**
 * Show StudyName
 */

test('Unathorized cannot Show StudyName', async ({ client }) => {
  const data = await StudyName.find(2)
  const response = await client
    .get(endPoint + '/'  + data.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show StudyName', async ({ client }) => {
  const user = await User.find(1)
  const editing = await StudyName.find(2)
  const response = await client
    .get(endPoint + '/'  + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted StudyName', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endPoint + '/'  + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete StudyName
 */

test('Unathorized cannot Delete StudyName', async ({ client }) => {
  const data = await StudyName.find(2)
  const response = await client
    .delete(endPoint + '/'  + data.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete StudyName', async ({ client }) => {
  const user = await User.find(1)
  const data = await StudyName.create({
    name: 'Test Delete Study Name',
  })
  const editing = await StudyName.find(data.id)
  const response = await client
    .delete(endPoint + '/'  + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Delete unexisted StudyName', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .delete(endPoint + '/'  + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Form Data
 */

function StudyNameData() {
  return {
    name: 'Test Study Name',
    description: '',
  }
}
