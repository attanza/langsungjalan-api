'use strict'

const Schedulle = use('App/Models/Schedulle')
const { RedisHelper, ResponseParser, PushNotifications } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')

const fillable = [
  'code',
  'marketing_id',
  'marketing_target_id',
  'marketing_action_id',
  'date',
  'description'
]

class SchedulleController {
  /**
   * Index
   * Get List of Schedulle
   */
  async index({ request, response }) {
    // const data = await SchedulleQueryTrait(request)
    // let parsed = ResponseParser.apiCollection(data)
    // return response.status(200).send(parsed)

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
      marketing_target_id,
      marketing_action_id,
      marketing_id
    } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10
    if (!sort_by) sort_by = 'id'
    if (!sort_mode) sort_mode = 'desc'

    if (search && search != '') {
      const data = await Schedulle.query()
        .with('target')
        .with('action')
        .with('report')
        .with('marketing')
        .where('code', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`)
        .orWhere('date', 'like', `%${search}%`)
        .orWhereHas('action', builder => {
          builder.where('name', 'like', `%${search}%`)
        })
        .orWhereHas('target', builder => {
          builder.where('code', 'like', `%${search}%`)
        })
        .orWhereHas('report', builder => {
          builder.where('code', 'like', `%${search}%`)
        })
        .orWhereHas('marketing', builder => {
          builder.where('name', 'like', `%${search}%`)
        })
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    }

    const redisKey = `Schedulle_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${marketing_id}${marketing_target_id}${marketing_action_id}`

    let cached = await RedisHelper.get(redisKey)

    if (cached) {
      return response.status(200).send(cached)
    }

    const data = await Schedulle.query()
      .with('target')
      .with('action')
      .with('report')
      .with('marketing')
      .where(function() {
        if (search_by && search_query) {
          return this.where(search_by, 'like', `%${search_query}%`)
        }
      })
      .where(function() {
        if (marketing_id && marketing_id != '') {
          return this.where('marketing_id', parseInt(marketing_id))
        }
      })
      .where(function() {
        if (marketing_target_id && marketing_target_id != '') {
          return this.where(
            'marketing_target_id',
            parseInt(marketing_target_id)
          )
        }
      })
      .where(function() {
        if (marketing_action_id) {
          return this.where(
            'marketing_action_id',
            parseInt(marketing_action_id)
          )
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
   * Store New Schedulle
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    if (!body.code || body.code == '') {
      body.code = Math.floor(Date.now() / 1000).toString()
    }
    const data = await Schedulle.create(body)
    await data.loadMany(['marketing', 'target', 'action'])
    await RedisHelper.delete('Schedulle_*')
    const activity = `Add new Schedulle '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    let fcmData = { to: parsed.data.marketing.uid }
    await PushNotifications.sendToMobile('newSchedulle', fcmData)
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * Schedulle by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `Schedulle_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await Schedulle.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.loadMany(['marketing', 'target', 'action'])
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update Schedulle by Id
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await Schedulle.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    const activity = `Update Schedulle '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Schedulle_*')
    await data.loadMany(['marketing', 'target', 'action'])
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete Schedulle by Id
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await Schedulle.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    let dataJson = data.toJSON()
    if (dataJson.report) {
      return response
        .status(400)
        .send(
          ResponseParser.errorResponse(
            'This Schedulle has report, cannot be deleted'
          )
        )
    }
    const activity = `Delete Schedulle '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Schedulle*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = SchedulleController
