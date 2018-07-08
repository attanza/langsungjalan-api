'use strict'

const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Marketings')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = '/api/v1/combo-data?model='

/**
 * List of Marketing Combo Data
 */

test('Marketing Combo Data List', async ({ client }) => {
  const user = await User.find(1)

  const response = await client
    .get(endpoint + 'Marketing')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * List of University Combo Data
 */

test('University Combo Data List', async ({ client }) => {
  const user = await User.find(1)

  const response = await client
    .get(endpoint + 'University')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * List of Permission Combo Data
 */

test('Permission Combo Data List', async ({ client }) => {
  const user = await User.find(1)

  const response = await client
    .get(endpoint + 'Permission')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * List of Study Program Combo Data
 */

// test('Study Program Combo Data List', async ({ client }) => {
//   const user = await User.find(1)

//   const response = await client
//     .get(endpoint + 'StudyProgram')
//     .loginVia(user, 'jwt')
//     .end()
//   response.assertStatus(200)
// })
