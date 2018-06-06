'use strict'

const University = use('App/Models/University')
const { RedisHelper } = use('App/Helpers')
const User = use('App/Models/User')


class ComboDataController {
  async index({ request, response }) {
    const { model } = request.get()
    switch (model) {
      case 'University':
        {
          const universities = await this.getUniversities()
          return response.status(200).send(universities)
        }

      case 'Marketing':
        {
          const marketings = await this.getMarketings()
          return response.status(200).send(marketings)
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
    return data
  }

  async getMarketings() {
    let redisKey = 'Marketing_Combo'
    let cached = await RedisHelper.get(redisKey)

    if (cached != null) {
      return cached
    }
    const data = await User.query().select('id', 'name')
      .doesntHave('supervisors')
      .where('role_id', 4)
      .orderBy('name')
      .fetch()
    await RedisHelper.set(redisKey, data)
    return data

  }
}

module.exports = ComboDataController
