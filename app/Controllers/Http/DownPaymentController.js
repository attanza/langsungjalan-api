"use strict"

const DownPayment = use("App/Models/DownPayment")
const { RedisHelper, ResponseParser, MailHelper } = use("App/Helpers")
const { ActivityTraits } = use("App/Traits")

const fillable = ["marketing_target_id", "name", "phone", "dp", "is_verified"]

class DownPaymentController {
  /**
   * Index
   * Get List of DownPayment
   */
  async index({ request, response }) {
    try {
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
      } = request.get()

      if (!page) page = 1
      if (!limit) limit = 10
      if (!sort_by) sort_by = "id"
      if (!sort_mode) sort_mode = "desc"

      const redisKey = `DownPayment_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${marketing_target_id}`

      let cached = await RedisHelper.get(redisKey)

      if (cached && !search) {
        return cached
      }

      const data = await DownPayment.query()
        .with("target")
        .where(function() {
          if (search && search != "") {
            this.where("dp", "like", `%${search}%`)
            this.orWhere("name", "like", `%${search}%`)
            this.orWhere("phone", "like", `%${search}%`)
            this.orWhereHas("target", builder => {
              builder.where("code", "like", `%${search}%`)
            })
          }

          if (marketing_target_id && marketing_target_id != "") {
            this.where("marketing_target_id", marketing_target_id)
          }

          if (search_by && search_query) {
            this.where(search_by, search_query)
          }

          if (between_date && start_date && end_date) {
            this.whereBetween(between_date, [start_date, end_date])
          }
        })
        .orderBy(sort_by, sort_mode)
        .paginate(page, limit)

      let parsed = ResponseParser.apiCollection(data.toJSON())

      if (!search || search == "") {
        await RedisHelper.set(redisKey, parsed)
      }
      return response.status(200).send(parsed)
    } catch (e) {
      console.log("e", e)
    }
  }

  /**
   * Store
   * Store New DownPayment
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    const data = await DownPayment.create(body)
    await data.load("target")
    await RedisHelper.delete("DownPayment_*")
    const activity = `Add new DownPayment '${data.id}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * storeFromStudent
   */

  async storeFromStudent({ request, response }) {
    try {
      let body = request.only(fillable)
      const data = await DownPayment.create(body)
      await data.loadMany(["target.study.studyName", "target.study.university"])
      await RedisHelper.delete("DownPayment_*")
      // MailHelper.newDpMail(data.toJSON())
      let parsed = ResponseParser.apiCreated(data.toJSON())
      return response.status(201).send(parsed)
    } catch (e) {
      console.log("e", e)
    }
  }

  /**
   * Show
   * DownPayment by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `DownPayment_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await DownPayment.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.load("target")

    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update DownPayment by Id
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await DownPayment.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    const activity = `Update DownPayment '${data.id}'`
    await ActivityTraits.saveActivity(request, auth, activity)

    await RedisHelper.delete("DownPayment_*")
    await data.load("target")
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete DownPayment by Id
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await DownPayment.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const activity = `Delete DownPayment '${data.id}'`
    await ActivityTraits.saveActivity(request, auth, activity)

    await RedisHelper.delete("DownPayment*")
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = DownPaymentController
