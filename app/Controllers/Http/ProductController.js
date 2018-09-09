'use strict'

const Product = use('App/Models/Product')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')

/**
 * ProductController
 *
 */

class ProductController {

  /**
   * Index
   * Get List of Products
   */
  async index({ request, response }) {
    let { page, limit, search } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10

    if (search && search != '') {
      const data = await Product.query()
        .where('code', 'like', `%${search}%`)
        .orWhere('name', 'like', `%${search}%`)
        .orWhere('measurement', 'like', `%${search}%`)
        .orWhere('price', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`)
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    } else {
      let redisKey = `Product_${page}_${limit}`
      let cached = await RedisHelper.get(redisKey)

      if (cached != null) {
        return response.status(200).send(cached)
      }

      const data = await Product.query()
        .orderBy('name')
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())

      await RedisHelper.set(redisKey, parsed)

      return response.status(200).send(parsed)
    }
  }

  /**
   * Store
   * Store New Products
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only(['code', 'name', 'measurement', 'price', 'description'])
    const data = await Product.create(body)
    await RedisHelper.delete('Product_*')
    await RedisHelper.delete('Dashboard_Data')
    const activity = `Add new Product '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }


  /**
   * Show
   * Product by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `Product_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await Product.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update Product by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only(['code', 'name', 'measurement', 'price', 'description'])
    const id = request.params.id
    const data = await Product.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    const activity = `Update Product '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Product_*')
    await RedisHelper.delete('Dashboard_Data')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete Product by Id
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await Product.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const activity = `Delete Product '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Product_*')
    await RedisHelper.delete('Dashboard_Data')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = ProductController
