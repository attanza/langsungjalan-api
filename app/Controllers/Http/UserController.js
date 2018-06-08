'use strict'

const User = use('App/Models/User')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits, ActivationTraits, UserQueryTraits } = use('App/Traits')

class UserController {

  /**
   * Index
   * Get List of Users
   */
  async index({ request, response }) {
    let { page, limit, search, role_id } = request.get()

    // Query with search
    if (search && search != '') {
      let query = new UserQueryTraits(page, limit, search, role_id)
      let parsed = await query.qBySearch()
      return response.status(200).send(parsed)

    // Query with role id
    } else if (role_id && parseInt(role_id) > 0) {
      let query = new UserQueryTraits(page, limit, search, role_id)
      let parsed = await query.qByRole()
      return response.status(200).send(parsed)

    // Query with Page and limit
    } else {
      let query = new UserQueryTraits(page, limit, search, role_id)
      let parsed = await query.qDefault()
      return response.status(200).send(parsed)
    }
  }

  /**
   * Store
   * Create New User
   */

  async store({ request, response, auth }) {
    let body = request.only(['name', 'email', 'password', 'phone', 'address', 'description', 'role_id', 'is_active'])
    const data = await User.create(body)
    await data.load('role')
    await ActivationTraits.createAndActivate(data)
    await RedisHelper.delete('User_*')
    const activity = `Add new User '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('User_*')
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * Get User by ID
   */

  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `User_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }

    const data = await User.query().with('role').where('id', id).first()
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    if(data.role_id === 3) {
      await data.load('marketings')
    }
    if(data.role_id === 4) {
      await data.load('supervisors')
    }
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update User data by ID
   */

  async update({ request, response, auth }) {
    const id = request.params.id
    const data = await User.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }

    let body = request.only(['name', 'email', 'phone', 'address', 'description', 'role_id', 'is_active'])

    await data.merge(body)
    await data.save()
    await data.load('role')

    const activity = `Update User '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('User_*')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete User data by ID
   */

  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await User.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }

    const activity = `Delete User '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('User_*')
    // Delete Relationship
    await data.tokens().delete()
    await data.supervisors().detach()
    await data.marketings().detach()
    // Delete Data
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = UserController
