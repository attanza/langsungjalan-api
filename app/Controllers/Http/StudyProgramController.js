'use strict'

const StudyProgram = use('App/Models/StudyProgram')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')

/**
 * StudyProgramController
 *
 */

class StudyProgramController {

  /**
   * Index
   * Get List of StudyPrograms
   */
  async index({ request, response }) {
    let { page, limit, search } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10

    if (search && search != '') {
      const data = await StudyProgram.query()
        .with('university')
        .where('name', 'like', `%${search}%`)
        .orWhere('address', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`)
        .orWhere('phone', 'like', `%${search}%`)
        .orWhere('contact_person', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`)
        .orWhere('class_per_year', 'like', `%${search}%`)
        .orWhere('students_per_class', 'like', `%${search}%`)
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    } else {
      let redisKey = `StudyProgram_${page}_${limit}`
      let cached = await RedisHelper.get(redisKey)

      if (cached != null) {
        return response.status(200).send(cached)
      }

      const data = await StudyProgram.query()
        .with('university')
        .orderBy('name')
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())

      await RedisHelper.set(redisKey, parsed)

      return response.status(200).send(parsed)
    }
  }

  /**
   * Store
   * Store New StudyPrograms
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only([
      'university_id', 'name', 'address', 'email', 'phone', 'contact_person', 'description', 'year',
      'class_per_year', 'students_per_class', 'lat', 'lng'
    ])
    const data = await StudyProgram.create(body)
    await RedisHelper.delete('StudyProgram_*')
    const activity = `Add new StudyProgram '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await data.load('university')
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }


  /**
   * Show
   * StudyProgram by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `StudyProgram_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await StudyProgram.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.load('university')
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update StudyProgram by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only([
      'university_id', 'name', 'address', 'email', 'phone', 'contact_person', 'description', 'year',
      'class_per_year', 'students_per_class', 'lat', 'lng'
    ])
    const id = request.params.id
    const data = await StudyProgram.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    const activity = `Update StudyProgram '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('StudyProgram_*')
    await data.load('university')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete StudyProgram by Id
   * Can only be done by Super Administrator
   * Default StudyProgram ['Super Administrator', 'Administrator', 'Supervisor', 'Marketing', 'Student'] cannot be deleted
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await StudyProgram.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const activity = `Delete StudyProgram '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('StudyProgram_*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = StudyProgramController
