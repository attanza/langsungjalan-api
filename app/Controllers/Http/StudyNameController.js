'use strict'

const StudyName = use('App/Models/StudyName')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const fillable = ['name', 'description']

/**
 * StudyNameController
 *
 */

class StudyNameController {

  /**
   * Index
   * Get List of StudyNames
   */
  async index({ request, response }) {
    let { page, limit, search } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10

    if (search && search != '') {
      const data = await StudyName.query()
        .where('name', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`)
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    } else {
      let redisKey = `StudyName_${page}_${limit}`
      let cached = await RedisHelper.get(redisKey)

      if (cached != null) {
        return response.status(200).send(cached)
      }

      const data = await StudyName.query().orderBy('name').paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())

      await RedisHelper.set(redisKey, parsed)

      return response.status(200).send(parsed)
    }
  }

  /**
   * Store
   * Store New StudyNames
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    const data = await StudyName.create(body)
    await RedisHelper.delete('StudyName_*')
    const activity = `Add new StudyName '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * StudyName by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `StudyName_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await StudyName.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update StudyName by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await StudyName.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    const activity = `Update StudyName '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('StudyName_*')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete StudyName by Id
   * Can only be done by Super Administrator
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await StudyName.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.studyPrograms().detach()
    const activity = `Delete StudyName '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('StudyName_*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = StudyNameController
