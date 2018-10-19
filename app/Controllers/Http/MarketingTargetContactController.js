'use strict'

const MarketingTargetContact = use('App/Models/MarketingTargetContact')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const fillable = [
  'marketing_target_id',
  'name',
  'title',
  'phone',
  'email',
]

/**
 * MarketingTargetContactController
 *
 */

class MarketingTargetContactController {

  /**
   * Index
   * Get List of MarketingTargetContacts
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

    if(search && search != '') {
      const data = await MarketingTargetContact.query()
        .with('target')
        .where('name', 'like', `%${search}%`)
        .orWhere('code', 'like', `%${search}%`)
        .orWhere('title', 'like', `%${search}%`)
        .orWhere('phone', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`)
        .where(function() {
          if (marketing_target_id) {
            return this.where(
              'marketing_target_id',
              parseInt(marketing_target_id)
            )
          }
        })
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    }

    const redisKey = `MarketingTargetContact_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${marketing_target_id}`

    let cached = await RedisHelper.get(redisKey)

    if (cached) {
      return response.status(200).send(cached)
    }

    const data = await MarketingTargetContact.query()
      .with('target')
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
      .where(function() {
        if (marketing_target_id) {
          return this.where(
            'marketing_target_id',
            parseInt(marketing_target_id)
          )
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
   * Store New MarketingTargetContacts
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    const data = await MarketingTargetContact.create(body)
    await data.load('target')
    await RedisHelper.delete('MarketingTargetContact_*')
    const activity = `Add new MarketingTargetContact '${data.id}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * MarketingTargetContact by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `MarketingTargetContact_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await MarketingTargetContact.find(id)
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
   * Update MarketingTargetContact by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await MarketingTargetContact.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    await data.load('target')
    const activity = `Update MarketingTargetContact '${data.id}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('MarketingTargetContact_*')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete MarketingTargetContact by Id
   * Can only be done by Super Administrator
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await MarketingTargetContact.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const activity = `Delete MarketingTargetContact '${data.id}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('MarketingTargetContact_*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = MarketingTargetContactController