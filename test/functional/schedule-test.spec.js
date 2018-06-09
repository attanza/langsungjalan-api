'use strict'


const Schedule = use('App/Models/Schedule')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Schedule')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = 'api/v1/schedules'

/**
 * List of Schedule
 */

test('Unathorized cannot get Schedule List', async ({ client }) => {
  const response = await client
    .get('/api/v1/schedules')
    .end()
  response.assertStatus(401)
})

test('Authorized can get Schedule List', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get('/api/v1/schedules')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Create Schedule
 */

test('Unathorized cannot create Schedule', async ({ client }) => {
  const response = await client
    .post(endpoint)
    .send(scheduleData())
    .end()
  response.assertStatus(401)
})

test('Authorized can Create Schedule', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .send(scheduleData())
    .end()
  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      'marketing_id': 3,
      'action': 'Wa ja dipir da2.',
      'study_id': 3,
    }
  })
})

test('Cannot Create Schedule with uncomplete data', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update Schedule
 */

test('Unathorized cannot Update Schedule', async ({ client }) => {
  const editing = await Schedule.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .send(scheduleData())
    .end()
  response.assertStatus(401)
})

test('Authorized can Update Schedule', async ({ client }) => {
  const user = await getAdmin()
  const editing = await Schedule.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .send(scheduleData())
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      'marketing_id': 3,
      'action': 'Wa ja dipir da2.',
      'study_id': 3,
    }
  })
})

test('Cannot Update unexisted Schedule', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .put(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .send(scheduleData())
    .end()
  response.assertStatus(400)
})

/**
 * Show Schedule
 */

test('Unathorized cannot Show Schedule', async ({ client }) => {
  const data = await Schedule.find(1)
  const response = await client
    .get(endpoint + '/' + data.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show Schedule', async ({ client }) => {
  const user = await User.find(1)
  const editing = await Schedule.find(2)
  const response = await client
    .get(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted Schedule', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete Schedule
 */

test('Unathorized cannot Delete Schedule', async ({ client }) => {
  const data = await Schedule.find(1)
  const response = await client
    .delete(endpoint + '/' + data.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete Schedule', async ({ client }) => {
  const user = await User.find(1)
  const editing = await Schedule.find(2)
  const response = await client
    .delete(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Delete unexisted Schedule', async ({ client }) => {
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

function scheduleData() {
  return {
    'marketing_id': 3,
    'action': 'Wa ja dipir da2.',
    'study_id': 3,
    'start_date': '2018-04-01T17:00:00.000Z',
    'end_date': '2018-10-16T17:00:00.000Z',
    'description': 'Nuagaebu gosirusa zohiz bavutbuj.'
  }
}

async function getAdmin() {
  return await User.query().where('role_id', 2).first()
}
