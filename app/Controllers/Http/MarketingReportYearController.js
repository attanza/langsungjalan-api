'use strict'

const MarketingReportYear = use('App/Models/MarketingReportYear')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const fillable = ['year', 'class', 'students', 'marketing_target_id']

/**
 * MarketingReportYearController
 *
 */

class MarketingReportYearController {
  /**
   * Index
   * Get List of MarketingReportYears
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
      marketing_target_id
    } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10
    if (!sort_by) sort_by = 'id'
    if (!sort_mode) sort_mode = 'desc'

    if (search && search != '') {
      const data = await MarketingReportYear.query()
        .with('target')
        .where('year', 'like', `%${search}%`)
        .orWhere('class', 'like', `%${search}%`)
        .orWhere('students', 'like', `%${search}%`)
        .orWhereHas('target', builder => {
          builder.where('code', 'like', `%${search}%` )
        })
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    }

    const redisKey = `MarketingReportYear_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${marketing_target_id}`

    let cached = await RedisHelper.get(redisKey)

    if (cached) {
      return response.status(200).send(cached)
    }

    const data = await MarketingReportYear.query()
      .with('target')
      .where(function() {
        if (search_by && search_query) {
          return this.where(search_by, 'like', `%${search_query}%`)
        }
      })
      .where(function() {
        if (marketing_target_id) {
          return this.where('marketing_target_id', parseInt(marketing_target_id))
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
   * Store New MarketingReportYears
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    const data = await MarketingReportYear.create(body)
    await RedisHelper.delete('MarketingReportYear_*')
    const activity = `Add new MarketingReportYear '${data.year}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * MarketingReportYear by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `MarketingReportYear_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await MarketingReportYear.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.load('target')
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update MarketingReportYear by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await MarketingReportYear.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    await data.load('target')
    const activity = `Update MarketingReportYear '${data.year}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('MarketingReportYear_*')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete MarketingReportYear by Id
   * Can only be done by Super Administrator
   * Default MarketingReportYear ['Super Administrator', 'Administrator', 'Supervisor', 'Marketing', 'Student'] cannot be deleted
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await MarketingReportYear.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const activity = `Delete MarketingReportYear '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('MarketingReportYear_*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = MarketingReportYearController
