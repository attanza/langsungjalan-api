"use strict"

const Schedulle = use("App/Models/Schedulle")
const { RedisHelper, ResponseParser, PushNotifications } = use("App/Helpers")
const { ActivityTraits } = use("App/Traits")

const fillable = [
  "code",
  "marketing_id",
  "marketing_target_id",
  "marketing_action_id",
  "date",
  "description",
]

class SchedulleController {
  /**
   * Index
   * Get List of Schedulle
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
        marketing_action_id,
        marketing_id,
      } = request.get()

      if (!page) page = 1
      if (!limit) limit = 10
      if (!sort_by) sort_by = "id"
      if (!sort_mode) sort_mode = "desc"

      const redisKey = `Schedulle_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${marketing_target_id}${marketing_action_id}${marketing_id}`

      let cached = await RedisHelper.get(redisKey)

      if (cached && !search) {
        return cached
      }

      const data = await Schedulle.query()
        .with("target.study.studyName")
        .with("target.study.university")
        .with("action", builder => {
          builder.select("id", "name")
        })
        .with("report", builder => {
          builder.select("id", "code")
        })
        .with("marketing", builder => {
          builder.select("id", "name")
        })
        .where(function() {
          if (search && search != "") {
            this.where("code", "like", `%${search}%`)
            this.orWhere("description", "like", `%${search}%`)
            this.orWhere("date", "like", `%${search}%`)
            this.orWhereHas("action", builder => {
              builder.where("name", "like", `%${search}%`)
            })
            this.orWhereHas("target", builder => {
              builder.where("code", "like", `%${search}%`)
            })
            this.orWhereHas("report", builder => {
              builder.where("code", "like", `%${search}%`)
            })
            this.orWhereHas("marketing", builder => {
              builder.where("name", "like", `%${search}%`)
            })
          }

          if (marketing_id && marketing_id != "") {
            this.where("marketing_id", marketing_id)
          }

          if (marketing_target_id && marketing_target_id != "") {
            this.where("marketing_target_id", marketing_target_id)
          }

          if (marketing_action_id && marketing_action_id != "") {
            this.where("marketing_action_id", marketing_action_id)
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
   * Store New Schedulle
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    if (!body.code || body.code == "") {
      body.code = Math.floor(Date.now() / 1000).toString()
    }
    const data = await Schedulle.create(body)
    await data.loadMany(["marketing", "target", "action"])
    await RedisHelper.delete("Schedulle_*")
    const activity = `Add new Schedulle '${data.code}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    if (parsed.data.marketing && parsed.data.marketing.uid) {
      const { uid } = parsed.data.marketing
      let fcmData = { to: uid }
      await PushNotifications.sendToMobile("newSchedulle", fcmData)
    }
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
    await data.loadMany([
      "marketing",
      "target.study.studyName",
      "target.study.university",
      "action",
    ])
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
    const activity = `Update Schedulle '${data.code}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete("Schedulle_*")
    await data.loadMany(["marketing", "target", "action"])
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
    // Check Relationship
    await data.load("report")
    let dataJSON = data.toJSON()

    if (dataJSON.schedulle && dataJSON.schedulle.length > 0) {
      return response
        .status(400)
        .send(
          ResponseParser.errorResponse(
            "This Schedulle cannot be deleted since it has Reports attached"
          )
        )
    }
    const activity = `Delete Schedulle '${data.code}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete("Schedulle*")
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = SchedulleController
