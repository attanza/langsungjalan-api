'use strict'

const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Marketings')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = '/api/v1/marketings'

/**
 * List of Marketing
 */

test('Unathorized cannot get Marketing List', async ({ client }) => {
  const response = await client
    .get(endpoint)
    .end()
  response.assertStatus(401)
})

test('Authorized can get Marketing List', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .get(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Create Marketing
 */

test('Unathorized cannot create Marketing', async ({ client }) => {
  const response = await client
    .post(endpoint)
    .send(MarketingData())
    .end()
  response.assertStatus(401)
})

test('Non Administrator cannot Create Marketing', async ({ client }) => {
  const user = await getMarketing()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .send(MarketingData())
    .end()
  response.assertStatus(403)
})

test('Administrator can Create Marketing', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .send(MarketingData())
    .end()
  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      name: 'Test Marketing',
      email: 'marketing@test.com',
      phone: '08909034789',
    }
  })
})

test('Cannot Create Marketing with uncomplete data', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update Marketing
 */

test('Unathorized cannot Update Marketing', async ({ client }) => {
  const user = await getMarketing()
  const response = await client
    .put('/api/v1/Marketings/' + user.id)
    .send(MarketingData())
    .end()
  response.assertStatus(401)
})

test('Non Administrator cannot Update Marketing', async ({ client }) => {
  const user = await getMarketing()
  const editing = await getMarketing()
  const response = await client
    .put('/api/v1/Marketings/' + editing.id)
    .loginVia(user, 'jwt')
    .send(MarketingData())
    .end()
  response.assertStatus(403)
})

test('Administrator can Update Marketing', async ({ client }) => {
  const user = await getAdmin()
  const editing = await getMarketing()
  const response = await client
    .put('/api/v1/Marketings/' + editing.id)
    .loginVia(user, 'jwt')
    .send(MarketingData())
    .end()
  response.assertStatus(200)
})

test('Cannot Update unexisted Marketing', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .put('/api/v1/Marketings/' + 35)
    .loginVia(user, 'jwt')
    .send(MarketingData())
    .end()
  response.assertStatus(400)
})

/**
 * Show Marketing
 */

test('Unathorized cannot Show Marketing', async ({ client }) => {
  const Marketing = await getMarketing()
  const response = await client
    .get('/api/v1/Marketings/' + Marketing.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show Marketing', async ({ client }) => {
  const user = await getAdmin()
  const editing = await getMarketing()
  const response = await client
    .get('/api/v1/Marketings/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted Marketing', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .get('/api/v1/Marketings/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete Marketing
 */

test('Unathorized cannot Delete Marketing', async ({ client }) => {
  const Marketing = await getMarketing()
  const response = await client
    .delete('/api/v1/Marketings/' + Marketing.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete Marketing', async ({ client }) => {
  const user = await getAdmin()
  const editing = await getMarketing()
  const response = await client
    .delete('/api/v1/Marketings/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Change Password
 */

test('Authorized can Change Password', async ({ client }) => {
  const user = await getAdmin()
  const editing = await getMarketing()
  const response = await client
    .put('/api/v1/marketings/' + editing.id + '/change-password')
    .loginVia(user, 'jwt')
    .send({
      'old_password': 'P4sw0rd@langsungjalan.com',
      'password': 'P4sw0rd@langsungjalan.com',
      'password_confirmation': 'P4sw0rd@langsungjalan.com'
    })
    .end()
  response.assertStatus(200)
})


/**
 * Form Data
 */

function MarketingData() {
  return {
    name: 'Test Marketing',
    email: 'marketing@test.com',
    password: 'password',
    phone: '08909034789',
    address: 'Jl. Bandung',
  }
}

async function getAdmin() {
  return await User.query().whereHas('roles', builder => {
    builder.where('role_id', 1)
  }).first()
}

async function getMarketing() {
  return await User.query().whereHas('roles', builder => {
    builder.where('role_id', 4)
  }).first()
}
