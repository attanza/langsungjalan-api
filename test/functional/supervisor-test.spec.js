'use strict'

const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Supervisors')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = '/api/v1/supervisors'

/**
 * List of Supervisor
 */

test('Unathorized cannot get Supervisor List', async ({ client }) => {
  const response = await client
    .get(endpoint)
    .end()
  response.assertStatus(401)
})

test('Authorized can get Supervisor List', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .get(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Create Supervisor
 */

test('Unathorized cannot create Supervisor', async ({ client }) => {
  const response = await client
    .post(endpoint)
    .send(supervisorData())
    .end()
  response.assertStatus(401)
})

test('Non Administrator cannot Create Supervisor', async ({ client }) => {
  const user = await getSupervisor()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .send(supervisorData())
    .end()
  response.assertStatus(403)
})

test('Administrator can Create Supervisor', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .send(supervisorData())
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

test('Cannot Create Supervisor with uncomplete data', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update Supervisor
 */

test('Unathorized cannot Update Supervisor', async ({ client }) => {
  const user = await getSupervisor()
  const response = await client
    .put('/api/v1/supervisors/' + user.id)
    .send(supervisorData())
    .end()
  response.assertStatus(401)
})

test('Non Administrator cannot Update Supervisor', async ({ client }) => {
  const user = await getSupervisor()
  const editing = await getSupervisor()
  const response = await client
    .put('/api/v1/supervisors/' + editing.id)
    .loginVia(user, 'jwt')
    .send(supervisorData())
    .end()
  response.assertStatus(403)
})

test('Administrator can Update Supervisor', async ({ client }) => {
  const user = await getAdmin()
  const editing = await getSupervisor()
  const response = await client
    .put('/api/v1/supervisors/' + editing.id)
    .loginVia(user, 'jwt')
    .send(supervisorData())
    .end()
  response.assertStatus(200)
})

test('Cannot Update unexisted Supervisor', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .put('/api/v1/supervisors/' + 35)
    .loginVia(user, 'jwt')
    .send(supervisorData())
    .end()
  response.assertStatus(400)
})

/**
 * Show Supervisor
 */

test('Unathorized cannot Show Supervisor', async ({ client }) => {
  const Supervisor = await getSupervisor()
  const response = await client
    .get('/api/v1/supervisors/' + Supervisor.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show Supervisor', async ({ client }) => {
  const user = await getAdmin()
  const editing = await getSupervisor()
  const response = await client
    .get('/api/v1/supervisors/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted Supervisor', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .get('/api/v1/supervisors/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete Supervisor
 */

test('Unathorized cannot Delete Supervisor', async ({ client }) => {
  const Supervisor = await User.find(4)
  const response = await client
    .delete('/api/v1/supervisors/' + Supervisor.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete Supervisor', async ({ client }) => {
  const user = await User.find(1)
  const editing = await User.find(3)
  const response = await client
    .delete('/api/v1/supervisors/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Attaching Marketing
 */

test('Non Admin cannot attach marketing', async ({ client }) => {
  const user = await User.find(3)
  const formData = await attachData()
  const response = await client
    .post('/api/v1/supervisor/attach-marketing')
    .loginVia(user, 'jwt')
    .send(formData)
    .end()
  response.assertStatus(403)
})

test('Admin can attach marketing', async ({ client }) => {
  const user = await User.find(1)
  const formData = await attachData()
  const response = await client
    .put('/api/v1/supervisor/detach-marketing')
    .loginVia(user, 'jwt')
    .send(formData)
    .end()
  response.assertStatus(200)
})

/**
 * Form Data
 */

function supervisorData() {
  return {
    name: 'Test Marketing',
    email: 'marketing@test.com',
    password: 'password',
    phone: '08909034789',
    address: 'Jl. Bandung',
  }
}

async function attachData() {
  const supervisor = await User.query().whereHas('roles', builder => {
    builder.where('role_id', 3)
  }).first()
  const marketing = await User.query().whereHas('roles', builder => {
    builder.where('role_id', 4)
  }).first()

  return {
    supervisor_id: supervisor.id,
    marketings: [marketing.id]
  }
}

async function getAdmin() {
  return await User.query().whereHas('roles', builder => {
    builder.where('role_id', 1)
  }).first()
}

async function getSupervisor() {
  return await User.query().whereHas('roles', builder => {
    builder.where('role_id', 3)
  }).first()
}
