'use strict'

const User = use('App/Models/User')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits, ActivationTraits } = use('App/Traits')

const fillable = ['name', 'email', 'password', 'phone', 'address', 'description', 'is_active']

class MarketingController {

  /**
   * Index
   * Get List of Marketing
   */
  async index({ request, response }) {
    let { page, limit, search } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10

    if (search && search != '') {
      const data = await User.query()
        .where('role_id', 4)
        .where('name', 'like', `%${this.search}%`)
        .orWhere('email', 'like', `%${this.search}%`)
        .orWhere('phone', 'like', `%${this.search}%`)
        .orWhere('address', 'like', `%${this.search}%`)
        .paginate(parseInt(this.page), parseInt(this.limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    } else {
      let redisKey = `Marketing_${page}_${limit}`
      let cached = await RedisHelper.get(redisKey)

      if (cached != null) {
        return response.status(200).send(cached)
      }

      const data = await User.query()
        .where('role_id', 4)
        .orderBy('name')
        .paginate(parseInt(this.page), parseInt(this.limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())

      await RedisHelper.set(redisKey, parsed)

      return response.status(200).send(parsed)
    }
  }

  /**
   * Store
   * Create New Marketing
   */

  async store({ request, response, auth }) {
    let body = request.only(fillable)
    body.role_id = 4
    const data = await User.create(body)
    await ActivationTraits.createAndActivate(data)
    await RedisHelper.delete('Marketing_*')
    await RedisHelper.delete('User_*')
    const activity = `Add new Marketing '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * Get Marketing by ID
   */

  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `Marketing_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await User.query().where('id', id).first()
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.load('supervisors')
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update Marketing data by ID
   */

  async update({ request, response, auth }) {
    const id = request.params.id
    const data = await User.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }

    let body = request.only(fillable)

    await data.merge(body)
    await data.save()
    await data.load('supervisors')
    const activity = `Update Marketing '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Marketing_*')
    await RedisHelper.delete('User_*')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)

  }

  /**
   * Delete
   * Delete Marketing data by ID
   */

  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await User.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }

    const activity = `Delete Marketing '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Marketing_*')
    await RedisHelper.delete('User_*')
    // Delete Relationship
    await data.tokens().delete()
    await data.supervisors().detach()
    // Delete Data
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = MarketingController
