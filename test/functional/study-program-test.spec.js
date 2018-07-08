'use strict'

const StudyProgram = use('App/Models/StudyProgram')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('StudyProgram')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = 'api/v1/studies'

/**
 * List of StudyProgram
 */

test('Unathorized cannot get StudyProgram List', async ({ client }) => {
  const response = await client
    .get(endpoint)
    .end()
  response.assertStatus(401)
})

test('Authorized can get StudyProgram List', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Create StudyProgram
 */

test('Unathorized cannot create StudyProgram', async ({ client }) => {
  const response = await client
    .post(endpoint)
    .send(StudyProgramData())
    .end()
  response.assertStatus(401)
})

test('Authorized can Create StudyProgram', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .send(StudyProgramData())
    .end()
  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      'university_id': 3,
      'study_name_id': 1,
      'address': '1077 Ditim Center',
      'email': 'cadewar@jojpojgih3.ws',
    }
  })
})

test('Cannot Create StudyProgram with uncomplete data', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update StudyProgram
 */

test('Unathorized cannot Update StudyProgram', async ({ client }) => {
  const editing = await StudyProgram.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .send(StudyProgramData())
    .end()
  response.assertStatus(401)
})

test('Authorized can Update StudyProgram', async ({ client }) => {
  const user = await getAdmin()
  const editing = await StudyProgram.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .send(StudyProgramData())
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      'university_id': 3,
      'study_name_id': 1,
      'address': '1077 Ditim Center',
      'email': 'cadewar@jojpojgih3.ws',
    }
  })
})

test('Cannot Update unexisted StudyProgram', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .put(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .send(StudyProgramData())
    .end()
  response.assertStatus(400)
})

/**
 * Show StudyProgram
 */

test('Unathorized cannot Show StudyProgram', async ({ client }) => {
  const studies = await StudyProgram.find(1)
  const response = await client
    .get(endpoint + '/' + studies.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show StudyProgram', async ({ client }) => {
  const user = await User.find(1)
  const editing = await StudyProgram.find(2)
  const response = await client
    .get(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted StudyProgram', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete StudyProgram
 */

test('Unathorized cannot Delete StudyProgram', async ({ client }) => {
  const studies = await StudyProgram.find(1)
  const response = await client
    .delete(endpoint + '/' + studies.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete StudyProgram', async ({ client }) => {
  const user = await User.find(1)
  const editing = await StudyProgram.find(2)
  const response = await client
    .delete(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Delete unexisted StudyProgram', async ({ client }) => {
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

function StudyProgramData() {
  return {
    'university_id': 3,
    'study_name_id': 1,
    'address': '1077 Ditim Center',
    'email': 'cadewar@jojpojgih3.ws',
    'phone': '(358) 958-2553',
    'contact_person': 'Lily Chapman',
    'description': 'Kugwo et fenba ibi ze ib new pecjo obfapag faoka ruinu za arubaz bil tuku vetraasu.',
    'year': '2019',
    'class_per_year': 30,
    'students_per_class': 43,
    'lat': -46.88105,
    'lng': 0.84585
  }
}

async function getAdmin() {
  return await User.query().whereHas('roles', builder => {
    builder.where('role_id', 1)
  }).first()
}
