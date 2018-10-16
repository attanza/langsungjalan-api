'use strict'

const MarketingReportAttachment = use('App/Models/MarketingReportAttachment')
const MarketingTarget = use('App/Models/MarketingTarget')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const Helpers = use('Helpers')
const Drive = use('Drive')
const fillable = ['marketing_target_id', 'caption', 'tags']

/**
 * MarketingReportAttachmentController
 *
 */

class MarketingReportAttachmentController {

  /**
   * Index
   * Get List of MarketingReportAttachments
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
      const data = await MarketingReportAttachment.query()
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

    const redisKey = `MarketingReportAttachment_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${marketing_target_id}`

    let cached = await RedisHelper.get(redisKey)

    if (cached) {
      return response.status(200).send(cached)
    }

    const data = await MarketingReportAttachment.query()
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
   * Store New MarketingReportAttachments
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

    await docFile.move(Helpers.publicPath('img/marketing_reports'), { name })

    if (!docFile.moved()) {
      return response.status(400).send(ResponseParser.errorResponse('file failed to upload'))
    }
    body.url = `/img/marketing_reports/${name}`
    const data = await MarketingReportAttachment.create(body)
    await RedisHelper.delete('MarketingReportAttachment_*')
    const activity = `Add new MarketingReportAttachment <Report Id ${target.code}>`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * MarketingReportAttachment by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `MarketingReportAttachment_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await MarketingReportAttachment.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update MarketingReportAttachment by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await MarketingReportAttachment.find(id)
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
    const activity = `Update MarketingReportAttachment '${data.id}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('MarketingReportAttachment_*')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete MarketingReportAttachment by Id
   * Can only be done by Super Administrator
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    let data = await MarketingReportAttachment.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }

    let exists = await Drive.exists(Helpers.publicPath(data.url))
    if(exists) {
      await Drive.delete(Helpers.publicPath(data.url))
    }
    const activity = `Delete MarketingReportAttachment '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('MarketingReportAttachment_*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = MarketingReportAttachmentController
