'use strict'

const Dashboard = use('App/Models/Dashboard')
const { RedisHelper } = use('App/Helpers')
const User = use('App/Models/User')
const Product = use('App/Models/Product')
const University = use('App/Models/University')


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

  async store({response}) {
    const totalMarketings = await User.query()
      .whereHas('roles', (builder) => {
        builder.where('slug', 'marketing')
      })
      .where('is_active', 1)
      .count('* as total')

    const totalProducts = await Product.query().count('* as total')
    const totalUniversities = await University.query().count('* as total')


    const dashboardDetails = {
      total_marketings: totalMarketings[0].total,
      total_products: totalProducts[0].total,
      total_universities: totalUniversities[0].total,
    }

    const whereClause = {
      id: 1
    }

    const dashboard = await Dashboard.findOrCreate(whereClause, dashboardDetails)

    const redisKey = 'Dashboard_Data'
    await RedisHelper.delete(redisKey)
    return response.status(200).send(dashboard)
  }
}

module.exports = DashboardController
