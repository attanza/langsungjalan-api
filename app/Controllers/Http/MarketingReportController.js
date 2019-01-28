"use strict"

const MarketingReport = use("App/Models/MarketingReport")
const { RedisHelper, ResponseParser } = use("App/Helpers")
const { ActivityTraits } = use("App/Traits")
const fillable = [
  "code",
  "schedulle_id",
  "method",
  "date",
  "terms",
  "result",
  "note",
  "lat",
  "lng",
  "description",
]

/**
 * MarketingReportController
 *
 */

class MarketingReportController {
  /**
   * Index
   * Get List of MarketingReports
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
        schedulle_id,
        marketing_target_id,
        university_id,
      } = request.get()

      if (!page) page = 1
      if (!limit) limit = 10
      if (!sort_by) sort_by = "id"
      if (!sort_mode) sort_mode = "desc"

      const redisKey = `MarketingReport_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${schedulle_id}${marketing_target_id}${university_id}`

      let cached = await RedisHelper.get(redisKey)

      if (cached && !search) {
        return cached
      }

      const data = await MarketingReport.query()
        .with("schedulle.marketing")
        .with("schedulle.target.study.university")
        .with("schedulle.target.study.studyName")
        .with("schedulle.action")
        .where(function() {
          if (search && search != "") {
            this.where("method", "like", `%${search}%`)
            this.orWhere("code", "like", `%${search}%`)
            this.orWhereHas("schedulle", builder => {
              // builder.where("code", "like", `%${search}%`)
              // builder.orWhereHas("marketing", builder2 => {
              //   builder2.where("name", "like", `%${search}%`)
              // })
              builder.whereHas("target", builder2 => {
                builder2.whereHas("study", builder3 => {
                  builder3.whereHas("university", builder4 => {
                    builder4.where("name", "like", `%${search}%`)
                  })
                  builder3.orWhereHas("studyName", builder4 => {
                    builder4.where("name", "like", `%${search}%`)
                  })
                })
              })
              builder.orWhereHas("action", builder2 => {
                builder2.where("name", "like", `%${search}%`)
              })
            })
          }

          if (search_by && search_query) {
            return this.where(search_by, "like", `%${search_query}%`)
          }

          if (between_date && start_date && end_date) {
            return this.whereBetween(between_date, [start_date, end_date])
          }

          if (marketing_target_id && marketing_target_id != "") {
            return this.whereHas("schedulle", builder => {
              builder.where("marketing_target_id", marketing_target_id)
            })
          }

          if (schedulle_id && schedulle_id != "") {
            return this.where("schedulle_id", parseInt(schedulle_id))
          }

          if (university_id && university_id != "") {
            return this.whereHas("schedulle", builder => {
              builder.whereHas("target", builder2 => {
                builder2.whereHas("study", builder3 => {
                  builder3.whereHas("university", builder4 => {
                    builder4.where("id", university_id)
                  })
                })
              })
            })
          }
        })
        .orderBy(sort_by, sort_mode)
        .paginate(parseInt(page), parseInt(limit))

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
   * Store New MarketingReports
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable)
    if (!body.code || body.code == "") {
      body.code = Math.floor(Date.now() / 1000).toString()
    }
    if (!body.date || body.date == "") {
      body.date = Date.now()
    }
    const data = await MarketingReport.create(body)
    await data.loadMany([
      "schedulle.marketing",
      "schedulle.action",
      "schedulle.target.study.studyName",
      "schedulle.target.study.university",
    ])

    await RedisHelper.delete("MarketingReport_*")
    const activity = `Add new MarketingReport '${data.code}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * MarketingReport by id
   */
  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `MarketingReport_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await MarketingReport.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.loadMany([
      "schedulle.marketing",
      "schedulle.action",
      "schedulle.target.study.studyName",
      "schedulle.target.study.university",
    ])
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update MarketingReport by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable)
    const id = request.params.id
    const data = await MarketingReport.find(id)
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.merge(body)
    await data.save()
    await data.loadMany([
      "schedulle.marketing",
      "schedulle.action",
      "schedulle.target.study.studyName",
      "schedulle.target.study.university",
    ])
    const activity = `Update MarketingReport '${data.code}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete("MarketingReport_*")
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete MarketingReport by Id
   * Can only be done by Super Administrator
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await MarketingReport.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const activity = `Delete MarketingReport '${data.code}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete("MarketingReport_*")
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }
}

module.exports = MarketingReportController
