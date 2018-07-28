'use strict'


const StudyYear = use('App/Models/StudyYear')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('StudyYears')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endPoint = '/api/v1/study-years'

/**
 * List of StudyYear
 */

test('Unathorized cannot get StudyYear List', async ({ client }) => {
  const response = await client
    .get(endPoint)
    .end()
  response.assertStatus(401)
})

test('Authorized can get StudyYear List', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endPoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Create StudyYear
 */

test('Unathorized cannot create StudyYear', async ({ client }) => {
  const response = await client
    .post(endPoint)
    .send(StudyYearData())
    .end()
  response.assertStatus(401)
})

test('Non Super Administrator cannot Create StudyYear', async ({ client }) => {
  const user = await User.find(2)
  const response = await client
    .post(endPoint)
    .loginVia(user, 'jwt')
    .send(StudyYearData())
    .end()
  response.assertStatus(403)
})

test('Super Administrator can Create StudyYear', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endPoint)
    .loginVia(user, 'jwt')
    .send(StudyYearData())
    .end()
  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      'study_program_id': 3,
      'year': '2021',
      'class_per_year': 12,
      'students_per_class': 36
    }
  })
})

test('Cannot Create StudyYear with uncomplete data', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endPoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update StudyYear
 */

test('Unathorized cannot Update StudyYear', async ({ client }) => {
  const editing = await StudyYear.find(2)
  const response = await client
    .put(endPoint + '/' + editing.id)
    .send(StudyYearData())
    .end()
  response.assertStatus(401)
})

test('Non Superadmin cannot Update StudyYear', async ({ client }) => {
  const user = await User.find(2)
  const editing = await StudyYear.find(2)
  const response = await client
    .put(endPoint + '/'  + editing.id)
    .loginVia(user, 'jwt')
    .send(StudyYearData())
    .end()
  response.assertStatus(403)
})

test('Superadmin can Update StudyYear', async ({ client }) => {
  const user = await User.find(1)
  const editing = await StudyYear.find(2)
  const response = await client
    .put(endPoint + '/'  + editing.id)
    .loginVia(user, 'jwt')
    .send(StudyYearData())
    .end()
  response.assertStatus(200)
})

test('Cannot Update unexisted StudyYear', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .put(endPoint + '/'  + 35)
    .loginVia(user, 'jwt')
    .send(StudyYearData())
    .end()
  response.assertStatus(400)
})

/**
 * Show StudyYear
 */

test('Unathorized cannot Show StudyYear', async ({ client }) => {
  const data = await StudyYear.find(2)
  const response = await client
    .get(endPoint + '/'  + data.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show StudyYear', async ({ client }) => {
  const user = await User.find(1)
  const editing = await StudyYear.find(2)
  const response = await client
    .get(endPoint + '/'  + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted StudyYear', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endPoint + '/'  + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete StudyYear
 */

test('Unathorized cannot Delete StudyYear', async ({ client }) => {
  const data = await StudyYear.find(2)
  const response = await client
    .delete(endPoint + '/'  + data.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete StudyYear', async ({ client }) => {
  const user = await User.find(1)
  const data = await StudyYear.create({
    year: '2020',
    'class_per_year': 12,
    'students_per_class': 36
  })
  const editing = await StudyYear.find(data.id)
  const response = await client
    .delete(endPoint + '/'  + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Delete unexisted StudyYear', async ({ client }) => {
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

function StudyYearData() {
  return {
    'study_program_id': 3,
    'year': '2021',
    'class_per_year': 12,
    'students_per_class': 36
  }
}
