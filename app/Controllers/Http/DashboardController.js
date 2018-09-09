'use strict'

const Dashboard = use('App/Models/Dashboard')
const { RedisHelper } = use('App/Helpers')

class DashboardController {
  async index({ response }) {
    const redisKey = 'Dashboard_Data'
    const cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }

    const dashboard = await Dashboard.first()
    await RedisHelper.set(redisKey, dashboard)
    return response.status(200).send(dashboard)
  }
}

module.exports = DashboardController
