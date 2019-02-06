"use strict"

const Activity = use("App/Models/Activity")
const { RedisHelper, ResponseParser, ErrorLog } = use("App/Helpers")

class ActivityController {
  /**
   * Index
   * Get List of Activities
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
        user_id,
      } = request.get()

      if (!page) page = 1
      if (!limit) limit = 10
      if (!sort_by) sort_by = "id"
      if (!sort_mode) sort_mode = "desc"

      const redisKey = `Activity_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${user_id}`

      let cached = await RedisHelper.get(redisKey)

      if (cached && !search) {
        return cached
      }

      const data = await Activity.query()
        .with("user", builder => {
          builder.select("id", "name")
        })
        .where(function() {
          if (search && search != "") {
            this.where("ip", "like", `%${search}%`)
            this.orWhere("browser", "like", `%${search}%`)
            this.orWhere("activity", "like", `%${search}%`)
            this.orWhereHas("user", builder => {
              builder.where("name", "like", `%${search}%`)
            })
          }

          if (user_id && user_id != "") {
            this.where("user_id", user_id)
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
      ErrorLog(request, e)
      return response.status(500).send(ResponseParser.unknownError())
    }
  }
}

module.exports = ActivityController
