"use strict"

const MarketingTarget = use("App/Models/MarketingTarget")
const { RedisHelper, ResponseParser } = use("App/Helpers")
const { ActivityTraits } = use("App/Traits")
const fillable = ["code", "study_program_id", "description"]

/**
 * MarketingTargetController
 *
 */

class MarketingTargetController {
  /**
   * Index
   * Get List of MarketingTargets
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
        study_id,
      } = request.get()

      if (!page) page = 1
      if (!limit) limit = 10
      if (!sort_by) sort_by = "created_at"
      if (!sort_mode) sort_mode = "desc"

      const redisKey = `MarketingTarget_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${study_id}`

      let cached = await RedisHelper.get(redisKey)

      if (cached && !search) {
        return cached
      }

      const data = await MarketingTarget.query()
        .with("study.studyName")
        .with("study.university")
        .where(function() {
          if (search && search != "") {
            this.where("code", "like", `%${search}%`)
            this.orWhereHas("study", builder => {
              builder.whereHas("university", builder2 => {
                builder2.where("name", "like", `%${search}%`)
              })
            })
            this.orWhereHas("study", builder => {
              builder.orWhereHas("studyName", builder2 => {
                builder2.where("name", "like", `%${search}%`)
              })
            })
          }

          if (study_id && study_id != "") {
            return this.where("study_program_id", parseInt(study_id))
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
   * Store New MarketingTargets
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    const data = await MarketingTarget.create(body)
    await data.loadMany(["study.studyName", "study.university"])
    await RedisHelper.delete("MarketingTarget_*")
    const activity = `Add new MarketingTarget '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * MarketingTarget by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `MarketingTarget_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await MarketingTarget.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.loadMany(["study.studyName", "study.university"])
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update MarketingTarget by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await MarketingTarget.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    await data.loadMany(["study.studyName", "study.university"])
    const activity = `Update MarketingTarget '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete("MarketingTarget_*")
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete MarketingTarget by Id
   * Can only be done by Super Administrator
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await MarketingTarget.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const activity = `Delete MarketingTarget '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete("MarketingTarget_*")
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }

  /**
   * Check if code is exists
   */
  async checkCode({ request, response }) {
    const { code } = request.params
    const target = await MarketingTarget.findBy("code", code)
    if (!target) {
      return response
        .status(400)
        .send(ResponseParser.errorResponse("Kode tidak valid"))
    }
    await target.loadMany(["study.university", "study.studyName"])
    return response.status(200).send(target)
  }
}

module.exports = MarketingTargetController
