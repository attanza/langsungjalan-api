'use strict'

const Dashboard = use('App/Models/Dashboard')

class DashboardSeeder {
  async run () {
    await Dashboard.truncate()
    await Dashboard.create({
      total_marketings: 0,
      total_products: 0,
      total_universities: 0,
    })
  }
}

module.exports = DashboardSeeder
