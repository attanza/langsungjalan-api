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
  const user = await User.find(1)
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
