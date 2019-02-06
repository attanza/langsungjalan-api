"use strict"

const StudyProgram = use("App/Models/StudyProgram")
const { RedisHelper, ResponseParser, ErrorLog } = use("App/Helpers")
const { ActivityTraits, CheckExist } = use("App/Traits")
const fillable = [
  "university_id",
  "study_name_id",
  "address",
  "email",
  "phone",
  "contact_person",
  "lat",
  "lng",
]
/**
 * StudyProgramController
 *
 */

class StudyProgramController {
  /**
   * Index
   * Get List of StudyPrograms
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
        university_id,
        study_name_id,
      } = request.get()

      if (!page) page = 1
      if (!limit) limit = 10
      if (!sort_by) sort_by = "id"
      if (!sort_mode) sort_mode = "desc"

      const redisKey = `StudyProgram_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}${university_id}${study_name_id}`

      let cached = await RedisHelper.get(redisKey)

      if (cached && !search) {
        return cached
      }

      const data = await StudyProgram.query()
        .with("university")
        .with("studyName")
        .where(function() {
          if (search && search != "") {
            this.where("address", "like", `%${search}%`)
            this.orWhere("email", "like", `%${search}%`)
            this.orWhere("phone", "like", `%${search}%`)
            this.orWhere("contact_person", "like", `%${search}%`)
            this.orWhereHas("university", builder => {
              builder.where("name", "like", `%${search}%`)
            })
            this.orWhereHas("studyName", builder => {
              builder.where("name", "like", `%${search}%`)
            })
          }

          if (university_id && university_id != "") {
            this.where("university_id", university_id)
          }

          if (study_name_id && study_name_id != "") {
            this.where("study_name_id", study_name_id)
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

  /**
   * Store
   * Store New StudyPrograms
   * Can only be done by Super Administrator
   */
  async store({ request, response, auth }) {
    try {
      let body = request.only(fillable)
      const isUniversityExists = await CheckExist(
        body.university_id,
        "University"
      )
      if (!isUniversityExists) {
        return response
          .status(422)
          .send(ResponseParser.apiValidationFailed("University not found"))
      }

      const isStudyNameExists = await CheckExist(
        body.study_name_id,
        "StudyName"
      )
      if (!isStudyNameExists) {
        return response
          .status(422)
          .send(ResponseParser.apiValidationFailed("StudyName not found"))
      }

      const data = await StudyProgram.create(body)
      await data.loadMany(["university", "studyName"])
      await RedisHelper.delete("StudyProgram_*")
      await RedisHelper.delete("StudyYear_*")
      await RedisHelper.delete("MarketingTarget_*")
      const jsonData = data.toJSON()
      const activity = `Add new StudyProgram "${jsonData.studyName.name}" in "${
        jsonData.university.name
      }" university`
      await ActivityTraits.saveActivity(request, auth, activity)
      let parsed = ResponseParser.apiCreated(data.toJSON())
      return response.status(201).send(parsed)
    } catch (e) {
      ErrorLog(request, e)
      return response.status(500).send(ResponseParser.unknownError())
    }
  }

  /**
   * Show
   * StudyProgram by id
   */
  async show({ request, response }) {
    try {
      const id = request.params.id
      let redisKey = `StudyProgram_${id}`
      let cached = await RedisHelper.get(redisKey)
      if (cached) {
        return response.status(200).send(cached)
      }
      const data = await StudyProgram.find(id)
      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound())
      }
      await data.loadMany({
        university: null,
        studyName: null,
        // years: builder => builder.orderBy('year')
      })

      let parsed = ResponseParser.apiItem(data.toJSON())
      await RedisHelper.set(redisKey, parsed)
      return response.status(200).send(parsed)
    } catch (e) {
      ErrorLog(request, e)
      return response.status(500).send(ResponseParser.unknownError())
    }
  }

  /**
   * Update
   * Update StudyProgram by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response, auth }) {
    try {
      let body = request.only(fillable)
      const id = request.params.id
      const data = await StudyProgram.find(id)
      if (!data || data.length === 0) {
        return response.status(400).send(ResponseParser.apiNotFound())
      }
      const isUniversityExists = await CheckExist(
        body.university_id,
        "University"
      )
      if (!isUniversityExists) {
        return response
          .status(422)
          .send(ResponseParser.apiValidationFailed("University not fund"))
      }

      const isStudyNameExists = await CheckExist(
        body.study_name_id,
        "StudyName"
      )
      if (!isStudyNameExists) {
        return response
          .status(422)
          .send(ResponseParser.apiValidationFailed("StudyName not fund"))
      }
      await data.merge(body)
      await data.save()
      await RedisHelper.delete("StudyProgram_*")
      await RedisHelper.delete("StudyYear_*")
      await RedisHelper.delete("MarketingTarget_*")
      await data.loadMany(["university", "studyName", "years"])
      const jsonData = data.toJSON()
      const activity = `Update StudyProgram "${jsonData.studyName.name}" in "${
        jsonData.university.name
      }" university`
      await ActivityTraits.saveActivity(request, auth, activity)
      let parsed = ResponseParser.apiUpdated(data.toJSON())
      return response.status(200).send(parsed)
    } catch (e) {
      ErrorLog(request, e)
      return response.status(500).send(ResponseParser.unknownError())
    }
  }

  /**
   * Delete
   * Delete StudyProgram by Id
   * Can only be done by Super Administrator
   */
  async destroy({ request, response, auth }) {
    try {
      const id = request.params.id
      const data = await StudyProgram.find(id)
      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound())
      }
      await data.loadMany(["targets", "years", "university", "studyName"])
      const dataJSON = data.toJSON()
      if (dataJSON.targets && dataJSON.targets.length > 0) {
        return response
          .status(400)
          .send(
            ResponseParser.errorResponse(
              "Target cannot be deleted since it has Marketing Targets attached"
            )
          )
      }
      if (dataJSON.years && dataJSON.years.length > 0) {
        return response
          .status(400)
          .send(
            ResponseParser.errorResponse(
              "Target cannot be deleted since it has Years attached"
            )
          )
      }
      const jsonData = data.toJSON()
      const activity = `Delete StudyProgram "${jsonData.studyName.name}" in "${
        jsonData.university.name
      }" university`
      await ActivityTraits.saveActivity(request, auth, activity)
      await RedisHelper.delete("StudyProgram_*")
      await RedisHelper.delete("StudyYear_*")
      await RedisHelper.delete("MarketingTarget_*")
      await data.delete()
      return response.status(200).send(ResponseParser.apiDeleted())
    } catch (e) {
      ErrorLog(request, e)
      return response.status(500).send(ResponseParser.unknownError())
    }
  }
}

module.exports = StudyProgramController
