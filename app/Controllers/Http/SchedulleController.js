'use strict'

const Schedulle = use('App/Models/Schedulle')
const { RedisHelper, ResponseParser, PushNotifications } = use('App/Helpers')
const { ActivityTraits, SchedulleQueryTrait } = use('App/Traits')
const moment = require('moment')
const fillable = [
  'marketing_id',
  'marketing_action_id',
  'study_id',
  'start_date',
  'end_date',
  'description'
]
/*
marketing_id
action
study_id
start_date
end_date
description
*/

class SchedulleController {
  /**
   * Index
   * Get List of Schedulle
   */
  async index({ request, response }) {
    const data = await SchedulleQueryTrait(request)
    let parsed = ResponseParser.apiCollection(data)
    return response.status(200).send(parsed)
  }

  /**
   * Store
   * Store New Schedulle
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    let start_date = moment(body.start_date).format('YYYY-MM-DD')
    if (!body.end_date || body.end_date === '') {
      body.end_date = start_date + ' 17:00'
    }
    const data = await Schedulle.create(body)
    await data.loadMany([
      'marketing',
      'study.studyName',
      'action',
      'study.university'
    ])
    await RedisHelper.delete('Schedulle_*')
    const activity = `Add new Schedulle '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    let fcmData = { to: parsed.data.marketing.uid}
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
    await data.loadMany(['marketing', 'study.studyName', 'action'])
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
    await data.loadMany([
      'marketing',
      'study.studyName',
      'action',
      'study.university'
    ])
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
    await data.load('report')
    let dataJson = data.toJSON()
    if(dataJson.report) {
      return response.status(400).send(ResponseParser.errorResponse('This Schedulle has report, cannot be deleted'))
    }
    const activity = `Delete Schedulle '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Schedulle*')
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = SchedulleController
