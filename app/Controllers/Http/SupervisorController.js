'use strict'

const User = use('App/Models/User')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits, ActivationTraits } = use('App/Traits')

const fillable = ['name', 'email', 'password', 'phone', 'address', 'description', 'is_active']

class SupervisorController {

  /**
   * Index
   * Get List of Supervisors
   */
  async index({ request, response }) {
    let { page, limit, search } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10

    if (search && search != '') {
      const data = await User.query()
        .where('role_id', 3)
        .where('name', 'like', `%${this.search}%`)
        .orWhere('email', 'like', `%${this.search}%`)
        .orWhere('phone', 'like', `%${this.search}%`)
        .orWhere('address', 'like', `%${this.search}%`)
        .paginate(parseInt(this.page), parseInt(this.limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    } else {
      let redisKey = `Supervisor_${page}_${limit}`
      let cached = await RedisHelper.get(redisKey)

      if (cached != null) {
        return response.status(200).send(cached)
      }

      const data = await User.query()
        .where('role_id', 3)
        .orderBy('name')
        .paginate(parseInt(this.page), parseInt(this.limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())

      await RedisHelper.set(redisKey, parsed)

      return response.status(200).send(parsed)
    }
  }

  /**
   * Store
   * Create New Supervisor
   */

  async store({ request, response, auth }) {
    let body = request.only(fillable)
    body.role_id = 3
    const data = await User.create(body)
    await ActivationTraits.createAndActivate(data)
    await RedisHelper.delete('Supervisor_*')
    await RedisHelper.delete('User_*')
    const activity = `Add new Supervisor '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * Get Supervisor by ID
   */

  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `Supervisor_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await User.query().where('id', id).first()
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.load('marketings')
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update Supervisor data by ID
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
    const activity = `Update Supervisor '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Supervisor_*')
    await RedisHelper.delete('User_*')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete Supervisor data by ID
   */

  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await User.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }

    const activity = `Delete Supervisor '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Supervisor_*')
    await RedisHelper.delete('User_*')
    // Delete Relationship
    await data.tokens().delete()
    await data.marketings().detach()
    // Delete Data
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }

  /**
   * Attaching Marketings to Supervisor
   */

  async attachMarketing({ request, response, auth }) {
    const { supervisor_id, marketings } = request.only(['supervisor_id', 'marketings'])
    // Check if Supervisor exist
    const supervisor = await User.find(supervisor_id)
    if (!supervisor) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    // Check Marketings
    let filteredMarketings = []
    marketings.forEach(async (m) => {
      let marketing = await User.find(m)
      if(marketing.role_id === 4) {
        filteredMarketings.push(marketing.id)
      }
    })
    await supervisor.marketings().attach(filteredMarketings)
    await supervisor.load('marketings')
    const activity = 'Attaching Marktings to Supervisor'
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete(`User_${supervisor_id}`)
    await RedisHelper.delete(`Supervisor_${supervisor_id}`)
    await RedisHelper.delete('Marketing_Combo')
    return response.status(200).send(ResponseParser.successResponse(supervisor, 'Marketing attached'))
  }

  async detachMarketing({ request, response, auth }) {
    const { supervisor_id, marketings } = request.only(['supervisor_id', 'marketings'])
    const supervisor = await User.find(supervisor_id)
    if (!supervisor) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await supervisor.marketings().detach(marketings)
    await supervisor.load('marketings')
    const activity = 'Detach Marktings from Supervisor'
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete(`User_${supervisor_id}`)
    await RedisHelper.delete(`Supervisor_${supervisor_id}`)
    await RedisHelper.delete('Marketing_Combo')
    return response.status(200).send(ResponseParser.successResponse(supervisor, 'Marketing detached'))
  }
}

module.exports = SupervisorController
