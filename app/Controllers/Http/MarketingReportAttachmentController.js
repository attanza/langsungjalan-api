'use strict'

const MarketingReportAttachment = use('App/Models/MarketingReportAttachment')
const MarketingReport = use('App/Models/MarketingReport')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const Helpers = use('Helpers')
const Drive = use('Drive')
const fillable = ['marketing_report_id', 'caption', 'tags']

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
    let data = await this.marketingReportQuery(request)

    return response.status(200).send(data)
  }

  /**
   * Store
   * Store New MarketingReportAttachments
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)

    // Check if marketing report exist
    const report = await MarketingReport.find(parseInt(body.marketing_report_id))
    if(!report) {
      return response.status(400).send(ResponseParser.errorResponse('Marketing Report not found'))
    }

    const docFile = request.file('file')

    if (!docFile) {
      return response.status(400).send(ResponseParser.errorResponse('File to be uploaded is required'))
    }
    const name = `${body.marketing_report_id}_${new Date().getTime()}.${docFile.subtype}`

    await docFile.move(Helpers.publicPath('img/marketing_reports'), { name })

    if (!docFile.moved()) {
      return response.status(400).send(ResponseParser.errorResponse('file failed to upload'))
    }
    body.url = `/img/marketing_reports/${name}`
    const data = await MarketingReportAttachment.create(body)
    await RedisHelper.delete('MarketingReportAttachment_*')
    const activity = `Add new MarketingReportAttachment <Report Id ${report.id}>`
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
    // Check if marketing report exist
    const report = await MarketingReport.find(parseInt(body.marketing_report_id))
    if(!report) {
      return response.status(400).send(ResponseParser.errorResponse('Marketing Report not found'))
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

  async marketingReportQuery(request) {
    let { page, limit, search, marketing_report_id } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10

    if(marketing_report_id) {
      if (search && search != '') {
        const data = await MarketingReportAttachment.query()
          .where('url', 'like', `%${search}%`)
          .orWhere('caption', 'like', `%${search}%`)
          .orWhere('tags', 'like', `%${search}%`)
          .where('marketing_report_id', parseInt(marketing_report_id))
          .paginate(parseInt(page), parseInt(limit))
        let parsed = ResponseParser.apiCollection(data.toJSON())
        return parsed
      } else {
        let redisKey = `MarketingReportAttachment_${page}_${limit}_MarketingReportId_${marketing_report_id}`
        let cached = await RedisHelper.get(redisKey)

        if (cached != null) {
          return cached
        }

        const data = await MarketingReportAttachment.query()
          .where('marketing_report_id', parseInt(marketing_report_id))
          .orderBy('id')
          .paginate(parseInt(page), parseInt(limit))
        let parsed = ResponseParser.apiCollection(data.toJSON())

        await RedisHelper.set(redisKey, parsed)

        return parsed
      }
    } else {
      if (search && search != '') {
        const data = await MarketingReportAttachment.query()
          .where('url', 'like', `%${search}%`)
          .orWhere('caption', 'like', `%${search}%`)
          .orWhere('tags', 'like', `%${search}%`)
          .paginate(parseInt(page), parseInt(limit))
        let parsed = ResponseParser.apiCollection(data.toJSON())
        return parsed
      } else {
        let redisKey = `MarketingReportAttachment_${page}_${limit}`
        let cached = await RedisHelper.get(redisKey)

        if (cached != null) {
          return cached
        }

        const data = await MarketingReportAttachment.query().orderBy('id').paginate(parseInt(page), parseInt(limit))
        let parsed = ResponseParser.apiCollection(data.toJSON())

        await RedisHelper.set(redisKey, parsed)

        return parsed
      }
    }
  }
}

module.exports = MarketingReportAttachmentController
