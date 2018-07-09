'use strict'


const MarketingAction = use('App/Models/MarketingAction')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('MarketingActions')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endPoint = '/api/v1/marketing-actions'

/**
 * List of MarketingAction
 */

test('Unathorized cannot get MarketingAction List', async ({ client }) => {
  const response = await client
    .get(endPoint)
    .end()
  response.assertStatus(401)
})

test('Authorized can get MarketingAction List', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endPoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Create MarketingAction
 */

test('Unathorized cannot create MarketingAction', async ({ client }) => {
  const response = await client
    .post(endPoint)
    .send(MarketingActionData())
    .end()
  response.assertStatus(401)
})

test('Non Super Administrator cannot Create MarketingAction', async ({ client }) => {
  const user = await User.find(2)
  const response = await client
    .post(endPoint)
    .loginVia(user, 'jwt')
    .send(MarketingActionData())
    .end()
  response.assertStatus(403)
})

test('Super Administrator can Create MarketingAction', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endPoint)
    .loginVia(user, 'jwt')
    .send(MarketingActionData())
    .end()
  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      'name': 'Test Create Marketing Action',
      'description': 'Olafijvo mapzirci cod ziguape.'
    }
  })
})

test('Cannot Create MarketingAction with uncomplete data', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endPoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update MarketingAction
 */

test('Unathorized cannot Update MarketingAction', async ({ client }) => {
  const editing = await MarketingAction.find(2)
  const response = await client
    .put(endPoint + '/' + editing.id)
    .send(MarketingActionData())
    .end()
  response.assertStatus(401)
})

test('Non Superadmin cannot Update MarketingAction', async ({ client }) => {
  const user = await User.find(2)
  const editing = await MarketingAction.find(2)
  const response = await client
    .put(endPoint + '/'  + editing.id)
    .loginVia(user, 'jwt')
    .send(MarketingActionData())
    .end()
  response.assertStatus(403)
})

test('Superadmin can Update MarketingAction', async ({ client }) => {
  const user = await User.find(1)
  const editing = await MarketingAction.find(2)
  const response = await client
    .put(endPoint + '/'  + editing.id)
    .loginVia(user, 'jwt')
    .send(MarketingActionData())
    .end()
  response.assertStatus(200)
})

test('Cannot Update unexisted MarketingAction', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .put(endPoint + '/'  + 35)
    .loginVia(user, 'jwt')
    .send(MarketingActionData())
    .end()
  response.assertStatus(400)
})

/**
 * Show MarketingAction
 */

test('Unathorized cannot Show MarketingAction', async ({ client }) => {
  const data = await MarketingAction.find(2)
  const response = await client
    .get(endPoint + '/'  + data.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show MarketingAction', async ({ client }) => {
  const user = await User.find(1)
  const editing = await MarketingAction.find(2)
  const response = await client
    .get(endPoint + '/'  + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted MarketingAction', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endPoint + '/'  + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete MarketingAction
 */

test('Unathorized cannot Delete MarketingAction', async ({ client }) => {
  const data = await MarketingAction.find(2)
  const response = await client
    .delete(endPoint + '/'  + data.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete MarketingAction', async ({ client }) => {
  const user = await User.find(1)
  const data = await MarketingAction.create({
    name: 'Test Delete Study Name',
  })
  const editing = await MarketingAction.find(data.id)
  const response = await client
    .delete(endPoint + '/'  + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Delete unexisted MarketingAction', async ({ client }) => {
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

function MarketingActionData() {
  return {
    'name': 'Test Create Marketing Action',
    'description': 'Olafijvo mapzirci cod ziguape.'
  }
}
