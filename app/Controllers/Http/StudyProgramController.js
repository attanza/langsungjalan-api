'use strict'

const StudyProgram = use('App/Models/StudyProgram')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const fillable = [
  'university_id',
  'study_name_id',
  'address',
  'email',
  'phone',
  'contact_person',
  'lat',
  'lng'
]
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
      sort_mode,
      university_id,
      study_name_id
    } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10
    if (!sort_by) sort_by = 'id'
    if (!sort_mode) sort_mode = 'desc'

    if(search && search != '') {
      const data = await StudyProgram.query()
        .with('university')
        .with('studyName')
        .with('years', (builder) => {
          builder.orderBy('year')
        })
        .where('address', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`)
        .orWhere('phone', 'like', `%${search}%`)
        .orWhere('contact_person', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`)
        .orWhereHas('university', (builder) => {
          builder.where('name', 'like', `%${search}%`)
        })
        .orWhereHas('studyName', (builder) => {
          builder.where('name', 'like', `%${search}%`)
        })
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    }

    const redisKey = `StudyProgram_${page}${limit}${search_by}${search_query}${between_date}${start_date}${end_date}${sort_by}${sort_mode}${university_id}${study_name_id}`

    let cached = await RedisHelper.get(redisKey)

    if (cached) {
      return response.status(200).send(cached)
    }

    const data = await StudyProgram.query()
      .with('university')
      .with('studyName')
      .with('years', builder => {
        builder.orderBy('year')
      })
      .where(function() {
        if (search_by && search_query) {
          return this.where(search_by, 'like', `%${search_query}%`)
        }
      })
      .where(function() {
        if (university_id) {
          return this.where('university_id', parseInt(university_id))
        }
      })
      .where(function() {
        if (study_name_id) {
          return this.where('study_name_id', parseInt(study_name_id))
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
   * Store New StudyPrograms
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    const data = await StudyProgram.create(body)
    await RedisHelper.delete('StudyProgram_*')
    const activity = `Add new StudyProgram '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await data.loadMany(['university', 'studyName'])
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
    await data.loadMany({
      university: null,
      studyName: null,
      years: builder => builder.orderBy('year')
    })

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
    let body = request.only(fillable)
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
    await data.loadMany({
      university: null,
      studyName: null,
      years: builder => builder.orderBy('year')
    })
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
    await data.studyName().dissociate()
    const activity = `Delete StudyProgram '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('StudyProgram_*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = StudyProgramController
