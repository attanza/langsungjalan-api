'use strict'

const Product = use('App/Models/Product')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Product')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = 'api/v1/products'

/**
 * List of Product
 */

test('Unathorized cannot get Product List', async ({ client }) => {
  const response = await client
    .get(endpoint)
    .end()
  response.assertStatus(401)
})

test('Authorized can get Product List', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .get(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Create Product
 */

test('Unathorized cannot create Product', async ({ client }) => {
  const response = await client
    .post(endpoint)
    .send(ProductData())
    .end()
  response.assertStatus(401)
})

test('Authorized can Create Product', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .send(ProductData())
    .end()
  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      'code': '812683412',
      'name': 'Ba butunutem tufwami 2.',
      'measurement': 'Cuzuri.',
    }
  })
})

test('Cannot Create Product with uncomplete data', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update Product
 */

test('Unathorized cannot Update Product', async ({ client }) => {
  const editing = await Product.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .send(ProductData())
    .end()
  response.assertStatus(401)
})

test('Authorized can Update Product', async ({ client }) => {
  const user = await getAdmin()
  const editing = await Product.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .send(ProductData())
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      'code': '812683412',
      'name': 'Ba butunutem tufwami 2.',
      'measurement': 'Cuzuri.',
    }
  })
})

test('Cannot Update unexisted Product', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .put(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .send(ProductData())
    .end()
  response.assertStatus(400)
})

/**
 * Show Product
 */

test('Unathorized cannot Show Product', async ({ client }) => {
  const studies = await Product.find(1)
  const response = await client
    .get(endpoint + '/' + studies.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show Product', async ({ client }) => {
  const user = await getAdmin()
  const editing = await Product.find(2)
  const response = await client
    .get(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted Product', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .get(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete Product
 */

test('Unathorized cannot Delete Product', async ({ client }) => {
  const studies = await Product.find(1)
  const response = await client
    .delete(endpoint + '/' + studies.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete Product', async ({ client }) => {
  const user = await getAdmin()
  const editing = await Product.find(2)
  const response = await client
    .delete(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Delete unexisted Product', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .delete(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Form Data
 */

function ProductData() {
  return {
    'code': '812683412',
    'name': 'Ba butunutem tufwami 2.',
    'measurement': 'Cuzuri.',
    'price': 228984,
    'description': 'Retazuw zol labu bepoba.'
  }
}

async function getAdmin() {
  return await User.query().whereHas('roles', builder => {
    builder.where('role_id', 1)
  }).first()
}
