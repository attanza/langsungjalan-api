"use strict"

const ErrorLog = use("App/Models/ErrorLog")
const { RedisHelper, ResponseParser, MailHelper } = use("App/Helpers")
const { ActivityTraits } = use("App/Traits")
const fillable = [
  "url",
  "method",
  "error",
  "solve_by",
  "soleved_at",
  "action_to_solve",
]

class ErrorLogController {
  /**
   * Index
   * Get List of Universities
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
      } = request.get()

      if (!page) page = 1
      if (!limit) limit = 10
      if (!sort_by) sort_by = "id"
      if (!sort_mode) sort_mode = "desc"

      const redisKey = `ErrorLog_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}`

      let cached = await RedisHelper.get(redisKey)

      if (cached && !search) {
        return cached
      }

      const data = await ErrorLog.query()
        .where(function() {
          if (search && search != "") {
            this.where("from", "like", `%${search}%`)
            this.orWhere("resource", "like", `%${search}%`)
            this.orWhere("action", "like", `%${search}%`)
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
   * Store New ErrorLogs
   * Can only be done by Super Administrator
   */

  async store({ request, response, auth }) {
    try {
      let body = request.only(fillable)
      const data = await ErrorLog.create(body)
      await RedisHelper.delete("ErrorLog_*")
      let parsed = ResponseParser.apiCreated(data.toJSON())
      return response.status(201).send(parsed)
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Show
   * ErrorLog by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `ErrorLog_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await ErrorLog.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update ErrorLog by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await ErrorLog.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    await RedisHelper.delete("ErrorLog_*")
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete ErrorLog by Id
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await ErrorLog.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }

    await RedisHelper.delete("ErrorLog_*")
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = ErrorLogController
