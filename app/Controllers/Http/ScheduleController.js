'use strict'

const Schedule = use('App/Models/Schedule')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')

/*
marketing_id
action
study_id
start_date
end_date
description
*/

class ScheduleController {
  /**
   * Index
   * Get List of Schedule
   */
  async index({ request, response }) {
    let { page, limit, search } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10

    if (search && search != '') {
      const data = await Schedule.query()
        .with('marketing')
        .with('study')
        .where('action', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`)
        .orderBy('created_at')
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    } else {
      let redisKey = `Schedule_${page}_${limit}`
      let cached = await RedisHelper.get(redisKey)

      if (cached != null) {
        return response.status(200).send(cached)
      }

      const data = await Schedule.query()
        .with('marketing')
        .with('study')
        .orderBy('created_at')
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())

      await RedisHelper.set(redisKey, parsed)

      return response.status(200).send(parsed)
    }
  }

  /**
   * Store
   * Store New Schedule
   */
  async store({ request, response, auth }) {
    let body = request.only(['marketing_id', 'action', 'study_id', 'start_date', 'end_date', 'description'])
    const data = await Schedule.create(body)
    await RedisHelper.delete('Schedule_*')
    const activity = `Add new Schedule '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * Schedule by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `Schedule_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await Schedule.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.loadMany(['marketing', 'study'])
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update Schedule by Id
   */
  async update({ request, response, auth }) {
    let body = request.only(['marketing_id', 'action', 'study_id', 'start_date', 'end_date', 'description'])
    const id = request.params.id
    const data = await Schedule.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    const activity = `Update Schedule '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Schedule_*')
    await data.loadMany(['marketing', 'study'])
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete Schedule by Id
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await Schedule.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const activity = `Delete Schedule '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Schedule*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = ScheduleController
