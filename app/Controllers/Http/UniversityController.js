'use strict'

const University = use('App/Models/University')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')

const fillable = ['name', 'address', 'email', 'phone', 'contact_person', 'description', 'province', 'city', 'lat', 'lng']

class UniversityController {
  /**
   * Index
   * Get List of Universities
   */
  async index({ request, response }) {
    let {
      page,
      limit,
      search,
      search_by,
      search_query,
      between_date,
      start_date,
      end_date,
      sort_by,
      sort_mode
    } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10
    if (!sort_by) sort_by = 'id'
    if (!sort_mode) sort_mode = 'desc'

    if (search && search != '') {
      const data = await University.query()
        .where('name', 'like', `%${search}%`)
        .orWhere('address', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`)
        .orWhere('phone', 'like', `%${search}%`)
        .orWhere('contact_person', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`)
        .orWhere('province', 'like', `%${search}%`)
        .orWhere('city', 'like', `%${search}%`)
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    }

    const redisKey = `University_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}`

    let cached = await RedisHelper.get(redisKey)

    if (cached) {
      return response.status(200).send(cached)
    }

    const data = await University.query()
      .where(function() {
        if (search_by && search_query) {
          return this.where(search_by, 'like', `%${search_query}%`)
        }
      })
      .where(function() {
        if (between_date && start_date && end_date) {
          return this.whereBetween(between_date, [start_date, end_date])
        }
      })
      .orderBy(sort_by, sort_mode)
      .paginate(parseInt(page), parseInt(limit))

    let parsed = ResponseParser.apiCollection(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Store
   * Store New Universitys
   * Can only be done by Super Administrator
   */

  async store({ request, response, auth }) {
    let body = request.only(fillable)
    const data = await University.create(body)
    await RedisHelper.delete('University_*')
    await RedisHelper.delete('Dashboard_Data')
    const activity = `Add new University '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * University by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `University_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await University.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update University by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await University.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    const activity = `Update University '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('University_*')
    await RedisHelper.delete('Dashboard_Data')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete University by Id
   * Can only be done by Super Administrator
   * Default University ['Super Administrator', 'Administrator', 'Supervisor', 'Marketing', 'Student'] cannot be deleted
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await University.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const activity = `Delete University '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('University_*')
    await RedisHelper.delete('Dashboard_Data')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = UniversityController
