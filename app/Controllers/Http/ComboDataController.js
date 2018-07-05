'use strict'

const { RedisHelper, ResponseParser } = use('App/Helpers')
const University = use('App/Models/University')
const User = use('App/Models/User')
const Permission = use('App/Models/Permission')
const StudyProgram = use('App/Models/StudyProgram')


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
    const data = await StudyProgram.query().select('id', 'name').orderBy('id').fetch()
    await RedisHelper.set(redisKey, data)
    let parsed = ResponseParser.apiItem(data.toJSON())
    return parsed
  }
}

module.exports = ComboDataController
