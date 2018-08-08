'use strict'

const { RedisHelper, ResponseParser } = use('App/Helpers')
const University = use('App/Models/University')
const User = use('App/Models/User')
const Permission = use('App/Models/Permission')
const StudyProgram = use('App/Models/StudyProgram')
const StudyName = use('App/Models/StudyName')
const MarketingAction = use('App/Models/MarketingAction')

class ComboDataController {
  async index({ request, response }) {
    const { model } = request.get()
    switch (model) {
    case 'University':
    {
      const data = await this.getUniversities()
      return response.status(200).send(data)
    }

    case 'Marketing':
    {
      const data = await this.getMarketings()
      return response.status(200).send(data)
    }

    case 'MarketingAll':
    {
      const data = await this.getMarketingsAll()
      return response.status(200).send(data)
    }

    case 'Permission':
    {
      const data = await this.getPermissions()
      return response.status(200).send(data)
    }

    case 'StudyProgram':
    {
      const data = await this.getStudy()
      return response.status(200).send(data)
    }

    case 'StudyName':
    {
      const data = await this.getStudyName()
      return response.status(200).send(data)
    }

    case 'Action':
    {
      const data = await this.getMarketingAction()
      return response.status(200).send(data)
    }


    default:
      return response.status(400).send({ 'message': 'Model not found' })
    }
  }

  async getUniversities() {
    let redisKey = 'University_Combo'
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await University.query().select('id', 'name').orderBy('name').fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = ResponseParser.apiItem(data.toJSON())
    return parsed
  }

  async getMarketings() {
    let redisKey = 'Marketing_Combo'
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await User.query().select('id', 'name')
      .doesntHave('supervisors')
      .whereHas('roles', builder => {
        builder.where('role_id', 4)
      })
      .orderBy('name')
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = ResponseParser.apiItem(data.toJSON())
    return parsed
  }

  async getMarketingsAll() {
    let redisKey = 'Marketing_Combo_All'
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await User.query().select('id', 'name')
      .whereHas('roles', builder => {
        builder.where('role_id', 4)
      })
      .orderBy('name')
      .fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = ResponseParser.apiItem(data.toJSON())
    return parsed
  }

  async getPermissions() {
    let redisKey = 'Permission_Combo'
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await Permission.query().select('id', 'name').orderBy('id').fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = ResponseParser.apiItem(data.toJSON())
    return parsed
  }

  async getStudy() {
    let redisKey = 'StudyProgram_Combo'
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    // const data = await StudyProgram.query().with('studyName').select('id', 'study_name_id').orderBy('id').fetch()
    const data = await StudyProgram.query()
      .select('study_programs.id', 'study_names.name')
      .leftJoin('study_names', 'study_programs.study_name_id', 'study_names.id')
      .orderBy('study_names.name')
      .fetch()
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return parsed
  }

  async getStudyName() {
    let redisKey = 'StudyName_Combo'
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await StudyName.query().select('id', 'name').orderBy('id').fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = ResponseParser.apiItem(data.toJSON())
    return parsed
  }

  async getMarketingAction() {
    let redisKey = 'MarketingAction_Combo'
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await MarketingAction.query().select('id', 'name').orderBy('name').fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = ResponseParser.apiItem(data.toJSON())
    return parsed
  }
}

module.exports = ComboDataController
