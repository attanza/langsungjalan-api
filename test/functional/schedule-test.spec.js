'use strict'


const Schedule = use('App/Models/Schedule')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Schedule')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

/**
 * List of Role
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
