'use strict'

const MarketingReport = use('App/Models/MarketingReport')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const fillable = [
  'marketing_id',
  'schedulle_id',
  'marketing_action_id',
  'method',
  'contact_person',
  'contact_person_phone',
  'count_year',
  'count_class',
  'average_students',
  'count_attendances',
  'count_student_dps',
  'count_shared_packages',
  'count_orders',
  'count_cancel_order',
  'count_dps',
  'count_payments',
  'schedulle',
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
    let { page, limit, search } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10

    if (search && search != '') {
      const data = await MarketingReport.query()
        .with('marketing')
        .with('action')
        .with('schedulle')
        .where('method', 'like', `%${search}%`)
        .orWhere('contact_person', 'like', `%${search}%`)
        .orWhere('contact_person_phone', 'like', `%${search}%`)
        .orWhere('count_year', 'like', `%${search}%`)
        .orWhere('count_class', 'like', `%${search}%`)
        .orWhere('average_students', 'like', `%${search}%`)
        .orWhere('count_attendances', 'like', `%${search}%`)
        .orWhere('count_student_dps', 'like', `%${search}%`)
        .orWhere('count_shared_packages', 'like', `%${search}%`)
        .orWhere('count_orders', 'like', `%${search}%`)
        .orWhere('count_cancel_order', 'like', `%${search}%`)
        .orWhere('count_dps', 'like', `%${search}%`)
        .orWhere('count_payments', 'like', `%${search}%`)
        .orWhere('schedulle', 'like', `%${search}%`)
        .orWhere('terms', 'like', `%${search}%`)
        .orWhere('result', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`)
        .orderBy('created_at', 'desc')
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    } else {
      let redisKey = `MarketingReport_${page}_${limit}`
      let cached = await RedisHelper.get(redisKey)

      if (cached != null) {
        return response.status(200).send(cached)
      }

      const data = await MarketingReport.query()
        .with('marketing')
        .with('action')
        .with('schedulle')
        .orderBy('created_at', 'desc')
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())

      await RedisHelper.set(redisKey, parsed)

      return response.status(200).send(parsed)
    }
  }

  /**
   * Store
   * Store New MarketingReports
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    const data = await MarketingReport.create(body)
    await data.loadMany(['marketing', 'schedulle', 'action'])
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
    await data.loadMany(['marketing', 'schedulle', 'action'])
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
    await data.loadMany(['marketing', 'schedulle', 'action'])
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
    const activity = `Delete MarketingReport '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('MarketingReport_*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = MarketingReportController
