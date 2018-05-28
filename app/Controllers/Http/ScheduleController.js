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
   * Get List of StudyPrograms
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
}

module.exports = ScheduleController
