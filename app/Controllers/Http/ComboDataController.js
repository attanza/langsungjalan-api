"use strict"

const { RedisHelper, InArray } = use("App/Helpers")
const University = use("App/Models/University")
const User = use("App/Models/User")
const Role = use("App/Models/Role")
const Permission = use("App/Models/Permission")
const StudyProgram = use("App/Models/StudyProgram")
const StudyName = use("App/Models/StudyName")
const MarketingAction = use("App/Models/MarketingAction")
const Database = use("Database")
const MarketingTarget = use("App/Models/MarketingTarget")
const Schedulle = use("App/Models/Schedulle")

class ComboDataController {
  async index({ request, response }) {
    const { model, university_id, search, supervisor_id } = request.get()
    switch (model) {
      case "University": {
        const data = await this.getUniversities()
        return response.status(200).send(data)
      }

      case "Marketing": {
        const data = await this.getMarketings()
        return response.status(200).send(data)
      }

      case "MarketingAll": {
        const data = await this.getMarketingsAll(supervisor_id)
        return response.status(200).send(data)
      }

      case "Permission": {
        const data = await this.getPermissions()
        return response.status(200).send(data)
      }

      case "Role": {
        const data = await this.getRoles()
        return response.status(200).send(data)
      }

      case "StudyProgram": {
        const data = await this.getStudy(university_id)
        return response.status(200).send(data)
      }

      case "StudyName": {
        const data = await this.getStudyName()
        return response.status(200).send(data)
      }

      case "Action": {
        const data = await this.getMarketingAction()
        return response.status(200).send(data)
      }

      case "MarketingTarget": {
        const data = await this.getTarget(search)
        return response.status(200).send(data)
      }

      case "Schedulle": {
        const data = await this.getSchedulle(search)
        return response.status(200).send(data)
      }

      default:
        return response.status(400).send({
          message: "Model not found",
        })
    }
  }

  async getUniversities() {
    let redisKey = "University_Combo"
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await University.query()
      .select("id", "name")
      .orderBy("name")
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = data.toJSON()
    return parsed
  }

  async getMarketings() {
    let redisKey = "Marketing_Combo"
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await User.query()
      .select("id", "name")
      .doesntHave("supervisors")
      .whereHas("roles", builder => {
        builder.where("role_id", 4)
      })
      .where("is_active", 1)
      .orderBy("name")
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = data.toJSON()
    return parsed
  }

  async getMarketingsAll(supervisor_id) {
    let redisKey = `Marketing_Combo_All_${supervisor_id}`
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    if (supervisor_id && supervisor_id != "") {
      const user = await User.find(supervisor_id)
      const roles = await user.getRoles()
      if (
        InArray(roles, "super-administrator") ||
        InArray(roles, "administrator")
      ) {
        supervisor_id = null
      }
    }
    const data = await User.query()
      .select("id", "name")
      .where(function () {
        this.whereHas("roles", builder => {
          builder.where("role_id", 4)
        })
        this.where("is_active", 1)
        if (supervisor_id && supervisor_id != "") {
          this.whereHas("supervisors", builder => {
            return builder.where("supervisor_id", supervisor_id)
          })
        }
      })
      .orderBy("name")
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = data.toJSON()
    return parsed
  }

  async getPermissions() {
    let redisKey = "Permission_Combo"
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await Permission.query()
      .select("id", "name")
      .orderBy("id")
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = data.toJSON()
    return parsed
  }

  async getRoles() {
    let redisKey = "Role_Combo"
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await Role.query()
      .select("id", "name")
      .orderBy("id")
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = data.toJSON()
    return parsed
  }

  async getStudy(university_id) {
    let redisKey = `StudyProgram_Combo_${university_id}`
    let cached = await RedisHelper.get(redisKey)
    let data

    if (cached != null) {
      return cached
    }
    if (university_id && university_id) {
      data = await StudyProgram.query()
        .select(
          Database.raw(
            'study_programs.id, study_names.name, CONCAT(study_names.name, " ~ ",universities.name) AS university'
          )
        )
        .where("study_programs.university_id", university_id)
        .leftJoin(
          "study_names",
          "study_programs.study_name_id",
          "study_names.id"
        )
        .leftJoin(
          "universities",
          "universities.id",
          "study_programs.university_id"
        )
        .fetch()
    } else {
      data = await StudyProgram.query()
        .select(
          Database.raw(
            'study_programs.id, study_names.name, CONCAT(study_names.name, " ~ ",universities.name) AS university'
          )
        )
        .leftJoin(
          "study_names",
          "study_programs.study_name_id",
          "study_names.id"
        )
        .leftJoin(
          "universities",
          "universities.id",
          "study_programs.university_id"
        )
        .fetch()
    }

    let parsed = data.toJSON()
    await RedisHelper.set(redisKey, parsed)
    return parsed
  }

  async getStudyName() {
    let redisKey = "StudyName_Combo"
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await StudyName.query()
      .select("id", "name")
      .orderBy("name")
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = data.toJSON()
    return parsed
  }

  async getMarketingAction() {
    let redisKey = "MarketingAction_Combo"
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await MarketingAction.query()
      .select("id", "name")
      .orderBy("name")
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = data.toJSON()
    return parsed
  }

  async getTarget(search) {
    if (search && search != "") {
      return await MarketingTarget.query()
        .select("id", "code")
        .where("code", "like", `%${search}%`)
        .orderBy("id", "desc")
        .limit(100)
        .fetch()
    }

    let redisKey = "MarketingTarget_Combo"
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await MarketingTarget.query()
      .select("id", "code")
      .orderBy("id", "desc")
      .limit(100)
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = data.toJSON()
    return parsed
  }

  async getSchedulle(search) {
    if (search && search != "") {
      return await Schedulle.query()
        .select("id", "code")
        .where("code", "like", `%${search}%`)
        .orderBy("id", "desc")
        .limit(100)
        .fetch()
    }

    let redisKey = "Schedulle_Combo"
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await Schedulle.query()
      .select("id", "code")
      .orderBy("id", "desc")
      .limit(100)
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = data.toJSON()
    return parsed
  }
}

module.exports = ComboDataController
