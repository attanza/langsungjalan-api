'use strict'


const Schedulle = use('App/Models/Schedulle')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Schedulle')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = 'api/v1/schedulles'

/**
 * List of Schedulle
 */

test('Unathorized cannot get Schedulle List', async ({ client }) => {
  const response = await client
    .get(endpoint)
    .end()
  response.assertStatus(401)
})

test('Authorized can get Schedulle List', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

// List with Query

test('Query with marketing id', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint + '?marketing_id=3')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Query with start date and end date', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint + '?start_date=2018-04-02&end_date=2018-10-17')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Query with marketing, start date and end date', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint + '?start_date=2018-04-02&end_date=2018-10-17&marketing_id=3')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

// test('Query with search', async ({ client }) => {
//   const user = await User.find(1)
//   const response = await client
//     .get(endpoint + '?search_by=marketing_id&serach_query=3')
//     .loginVia(user, 'jwt')
//     .end()
//     console.log('response', response) //eslint-disable-line
//   response.assertStatus(200)
// })

// ?search_by=marketing_id&search_query=5

/**
 * Create Schedulle
 */

test('Unathorized cannot create Schedulle', async ({ client }) => {
  const response = await client
    .post(endpoint)
    .send(SchedulleData())
    .end()
  response.assertStatus(401)
})

test('Authorized can Create Schedulle', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .send(SchedulleData())
    .end()
  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      'marketing_id': 3,
      'marketing_action_id': 3,
      'study_id': 3,
    }
  })
})

test('Cannot Create Schedulle with uncomplete data', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update Schedulle
 */

test('Unathorized cannot Update Schedulle', async ({ client }) => {
  const editing = await Schedulle.find(1)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .send(SchedulleData())
    .end()
  response.assertStatus(401)
})

test('Authorized can Update Schedulle', async ({ client }) => {
  const user = await getAdmin()
  const editing = await Schedulle.find(1)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .send(SchedulleData())
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      'marketing_id': 3,
      'marketing_action_id': 3,
      'study_id': 3,
    }
  })
})

test('Cannot Update unexisted Schedulle', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .put(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .send(SchedulleData())
    .end()
  response.assertStatus(400)
})

/**
 * Show Schedulle
 */

test('Unathorized cannot Show Schedulle', async ({ client }) => {
  const data = await Schedulle.find(1)
  const response = await client
    .get(endpoint + '/' + data.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show Schedulle', async ({ client }) => {
  const user = await User.find(1)
  const editing = await Schedulle.find(1)
  const response = await client
    .get(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted Schedulle', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete Schedulle
 */

test('Unathorized cannot Delete Schedulle', async ({ client }) => {
  const data = await Schedulle.find(1)
  const response = await client
    .delete(endpoint + '/' + data.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete Schedulle', async ({ client }) => {
  const user = await User.find(1)
  const editing = await Schedulle.find(1)
  const response = await client
    .delete(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Delete unexisted Schedulle', async ({ client }) => {
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

function SchedulleData() {
  return {
    'marketing_id': 3,
    'marketing_action_id': 3,
    'study_id': 3,
    'start_date': '2018-04-01T17:00:00.000Z',
    'end_date': '2018-10-16T17:00:00.000Z',
    'description': 'Nuagaebu gosirusa zohiz bavutbuj.'
  }
}

async function getAdmin() {
  return await User.query().whereHas('roles', builder => {
    builder.where('role_id', 1)
  }).first()
}
