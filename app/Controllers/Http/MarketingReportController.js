'use strict'

const MarketingReport = use('App/Models/MarketingReport')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const fillable = [
  'schedulle_id',
  'method',
  'schedulle_date',
  'terms',
  'result',
  'lat',
  'lng',
  'description',
]

/**
 * MarketingReportController
 *
 */

class MarketingReportController {

  /**
   * Index
   * Get List of MarketingReports
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
      schedulle_id
    } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10
    if (!sort_by) sort_by = 'id'
    if (!sort_mode) sort_mode = 'desc'

    if(search && search != '') {
      const data = await MarketingReport.query()
        .with('schedulle.study.studyName')
        .with('schedulle.study.university')
        .with('schedulle.marketing')
        .where('method', 'like', `%${search}%`)
        .orWhereHas('schedulle', (builder) => {
          builder.where('code', 'like', `%${search}%`)
          builder.orWhereHas('marketing', (builder2) => {
            builder2.where('name', 'like', `%${search}%`)
          })
          builder.orWhereHas('study', (builder2) => {
            builder2.whereHas('university', (builder3) => {
              builder3.where('name', 'like', `%${search}%`)
            })
            builder2.orWhereHas('studyName', (builder3) => {
              builder3.where('name', 'like', `%${search}%`)
            })
          })
        })
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    }

    const redisKey = `MarketingReport_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${schedulle_id}`

    let cached = await RedisHelper.get(redisKey)

    if (cached) {
      return response.status(200).send(cached)
    }

    const data = await MarketingReport.query()
      .with('schedulle.study.studyName')
      .with('schedulle.study.university')
      .with('schedulle.marketing')
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
   * Store New MarketingReports
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    const data = await MarketingReport.create(body)
    await data.loadMany(['schedulle.study.studyName', 'schedulle.study.university', 'marketing'])
    await RedisHelper.delete('MarketingReport_*')
    const activity = `Add new MarketingReport '${data.id}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * MarketingReport by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `MarketingReport_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await MarketingReport.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.loadMany(['schedulle.study.studyName', 'schedulle.study.university', 'marketing'])
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update MarketingReport by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await MarketingReport.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    await data.loadMany(['schedulle.study.studyName', 'schedulle.study.university', 'marketing'])
    const activity = `Update MarketingReport '${data.id}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('MarketingReport_*')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete MarketingReport by Id
   * Can only be done by Super Administrator
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await MarketingReport.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const activity = `Delete MarketingReport '${data.id}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('MarketingReport_*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = MarketingReportController
