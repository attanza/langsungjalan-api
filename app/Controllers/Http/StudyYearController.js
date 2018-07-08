'use strict'

const StudyYear = use('App/Models/StudyYear')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const fillable = ['study_program_id', 'year', 'class_per_year', 'students_per_class']
const yearUniqueFailed = [
  {
    'message': 'Year is already exist',
    'field': 'year',
    'validation': 'unique'
  }
]
/**
 * StudyYearController
 *
 */

class StudyYearController {

  /**
   * Index
   * Get List of StudyYears
   */
  async index({ request, response }) {
    let { page, limit, search } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10

    if (search && search != '') {
      const data = await StudyYear.query()
        .where('year', 'like', `%${search}%`)
        .orWhere('class_per_year', 'like', `%${search}%`)
        .orWhere('students_per_class', 'like', `%${search}%`)
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    } else {
      let redisKey = `StudyYear_${page}_${limit}`
      let cached = await RedisHelper.get(redisKey)

      if (cached != null) {
        return response.status(200).send(cached)
      }

      const data = await StudyYear.query().orderBy('year').paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())

      await RedisHelper.set(redisKey, parsed)

      return response.status(200).send(parsed)
    }
  }

  /**
   * Store
   * Store New StudyYears
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    const exist = await this.checkStudyYear(body)
    if (exist) {
      return response.status(201).send(ResponseParser.apiValidationFailed(yearUniqueFailed))
    }
    const data = await StudyYear.create(body)
    await RedisHelper.delete('StudyYear_*')
    const activity = `Add new StudyYear '${data.year}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * StudyYear by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `StudyYear_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await StudyYear.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update StudyYear by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await StudyYear.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    const activity = `Update StudyYear '${data.year}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('StudyYear_*')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete StudyYear by Id
   * Can only be done by Super Administrator
   * Default StudyYear ['Super Administrator', 'Administrator', 'Supervisor', 'Marketing', 'Student'] cannot be deleted
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await StudyYear.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const activity = `Delete StudyYear '${data.year}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('StudyYear_*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }

  async checkStudyYear(body) {
    const study_program_id = body.study_program_id
    const year = body.year
    const count = await StudyYear.query()
      .where('study_program_id', study_program_id)
      .where('year', year)
      .getCount()
    if (count > 0) {
      return true
    } else {
      return false
    }
  }
}

module.exports = StudyYearController
