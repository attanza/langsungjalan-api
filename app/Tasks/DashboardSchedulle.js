"use strict"

const Task = use("Task")
const User = use("App/Models/User")
const University = use("App/Models/University")
const Product = use("App/Models/Product")
const Dashboard = use("App/Models/Dashboard")
const { RedisHelper } = use("App/Helpers")

class DashboardSchedulle extends Task {
  static get schedule() {
    return "0 0 * * * "
  }

  async handle() {
    this.info("Task DashboardSchedulle handle")

    const totalMarketings = await User.query()
      .whereHas("roles", builder => {
        builder.where("slug", "marketing")
      })
      .where("is_active", 1)
      .count("* as total")

    const totalProducts = await Product.query().count("* as total")
    const totalUniversities = await University.query().count("* as total")

    const dashboardDetails = {
      total_marketings: totalMarketings[0].total,
      total_products: totalProducts[0].total,
      total_universities: totalUniversities[0].total,
    }

    const whereClause = {
      id: 1,
    }

    await Dashboard.findOrCreate(whereClause, dashboardDetails)

    const redisKey = "Dashboard_Data"
    await RedisHelper.delete(redisKey)
  }
}

module.exports = DashboardSchedulle
