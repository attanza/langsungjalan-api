'use strict'

const University = use('App/Models/University')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Universities')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = 'api/v1/universities'

/**
 * List of University
 */

test('Unathorized cannot get University List', async ({ client }) => {
  const response = await client
    .get(endpoint)
    .end()
  response.assertStatus(401)
})

test('Authorized can get University List', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Create University
 */

test('Unathorized cannot create University', async ({ client }) => {
  const response = await client
    .post(endpoint)
    .send(UniversityData())
    .end()
  response.assertStatus(401)
})

test('Authorized can Create University', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .send(UniversityData())
    .end()
  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      name: 'Test University',
      email: 'test@test.com',
      phone: '08909034789',
    }
  })
})

test('Cannot Create University with uncomplete data', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update University
 */

test('Unathorized cannot Update University', async ({ client }) => {
  const editing = await University.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .send(UniversityData())
    .end()
  response.assertStatus(401)
})

test('Authorized can Update University', async ({ client }) => {
  const user = await getAdmin()
  const editing = await University.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .send(UniversityData())
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      name: 'Test University',
      email: 'test@test.com',
      phone: '08909034789',
    }
  })
})

test('Cannot Update unexisted University', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .put(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .send(UniversityData())
    .end()
  response.assertStatus(400)
})

/**
 * Show University
 */

test('Unathorized cannot Show University', async ({ client }) => {
  const university = await University.find(1)
  const response = await client
    .get(endpoint + '/' + university.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show University', async ({ client }) => {
  const user = await User.find(1)
  const editing = await University.find(2)
  const response = await client
    .get(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted University', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete University
 */

test('Unathorized cannot Delete University', async ({ client }) => {
  const university = await University.find(1)
  const response = await client
    .delete(endpoint + '/' + university.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete University', async ({ client }) => {
  const user = await User.find(1)
  const editing = await University.find(2)
  const response = await client
    .delete(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Delete unexisted University', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .delete(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Form Data
 */

function UniversityData() {
  return {
    name: 'Test University',
    email: 'test@test.com',
    phone: '08909034789',
    contact_person: 'Francis Buchanan',
    description: 'Mika voopca hudimzo ninu tolez iroru jibwiroh da zojetemow fennatpac sunwiwvu wi utehko jejvu pigfufnoh vohadiro gi.',
    province: 'YT',
    city: 'Lolkoig'
  }
}

async function getAdmin() {
  return await User.query().whereHas('roles', builder => {
    builder.where('role_id', 1)
  }).first()
}
