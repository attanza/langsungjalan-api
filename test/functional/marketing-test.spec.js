'use strict'

const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Marketing')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = 'api/v1/marketing'

/**
 * Attaching Supervisor
 */

test('Non Supervisor cannot attach Supervisor', async ({ client }) => {
  const user = await User.find(1)
  await user.merge({role_id: 4})
  await user.save()
  const response = await client
    .post(endpoint + '/add-supervisor')
    .loginVia(user, 'jwt')
    .send(formData())
    .end()
  response.assertStatus(403)
})

test('Admin can attach Supervisor', async ({ client }) => {
  const user = await User.find(1)
  await user.merge({role_id: 2})
  await user.save()
  const response = await client
    .post(endpoint + '/add-supervisor')
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
    marketing_id: 4
  }
}
