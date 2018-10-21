'use strict'

const TargetAttachment = use('App/Models/TargetAttachment')
const MarketingTarget = use('App/Models/MarketingTarget')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const Helpers = use('Helpers')
const Drive = use('Drive')
const fillable = ['marketing_target_id', 'caption', 'tags']

/**
 * TargetAttachmentController
 *
 */

class TargetAttachmentController {

  /**
   * Index
   * Get List of TargetAttachments
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
      const data = await TargetAttachment.query()
        .with('target')
        .where('url', 'like', `%${search}%`)
        .orWhere('caption', 'like', `%${search}%`)
        .orWhere('tags', 'like', `%${search}%`)
        .orWhereHas('target', builder => {
          builder.where('code', 'like', `%${search}%` )
        })
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())
      return response.status(200).send(parsed)
    }

    const redisKey = `TargetAttachment_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${marketing_target_id}`

    let cached = await RedisHelper.get(redisKey)

    if (cached) {
      return response.status(200).send(cached)
    }

    const data = await TargetAttachment.query()
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
   * Store New TargetAttachments
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)

    // Check if marketing report exist
    const target = await MarketingTarget.find(parseInt(body.marketing_target_id))
    if(!target) {
      return response.status(400).send(ResponseParser.errorResponse('Marketing Target not found'))
    }

    const docFile = request.file('file')

    if (!docFile) {
      return response.status(400).send(ResponseParser.errorResponse('File to be uploaded is required'))
    }
    const name = `${body.marketing_target_id}_${new Date().getTime()}.${docFile.subtype}`

    await docFile.move(Helpers.publicPath('img/marketing_target'), { name })

    if (!docFile.moved()) {
      return response.status(400).send(ResponseParser.errorResponse('file failed to upload'))
    }
    body.url = `/img/marketing_target/${name}`
    const data = await TargetAttachment.create(body)
    await data.load('target')
    await RedisHelper.delete('TargetAttachment_*')
    const activity = `Add new TargetAttachment <Target Code ${target.code}>`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * TargetAttachment by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `TargetAttachment_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await TargetAttachment.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update TargetAttachment by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await TargetAttachment.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    // Check if marketing target exist
    const target = await MarketingTarget.find(parseInt(body.marketing_target_id))
    if(!target) {
      return response.status(400).send(ResponseParser.errorResponse('Marketing Target not found'))
    }

    await data.merge(body)
    await data.save()
    await data.load('target')
    const activity = `Update TargetAttachment '${data.id}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('TargetAttachment_*')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    let data = await TargetAttachment.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }

    let exists = await Drive.exists(Helpers.publicPath(data.url))
    if(exists) {
      await Drive.delete(Helpers.publicPath(data.url))
    }
    const activity = `Delete TargetAttachment '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('TargetAttachment_*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = TargetAttachmentController
