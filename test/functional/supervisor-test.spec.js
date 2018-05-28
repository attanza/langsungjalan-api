'use strict'

const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Supervisor')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = 'api/v1/supervisor'

/**
 * Attaching Marketing
 */

test('Non Admin cannot attach marketing', async ({ client }) => {
  const user = await User.find(1)
  await user.merge({ role_id: 3 })
  await user.save()
  const response = await client
    .post(endpoint + '/add-marketing')
    .loginVia(user, 'jwt')
    .send(formData())
    .end()
  response.assertStatus(403)
})

test('Admin can attach marketing', async ({ client }) => {
  const user = await User.find(1)
  await user.merge({ role_id: 2 })
  await user.save()
  const response = await client
    .post(endpoint + '/add-marketing')
    .loginVia(user, 'jwt')
    .send(formData())
    .end()
  response.assertStatus(200)
})

/**
 * Form Data
 */

function formData() {
  return {
    supervisor_id: 3,
    marketings: [5, 5, 4, 4, 4]
  }
}
