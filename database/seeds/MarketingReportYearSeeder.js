'use strict'

const Factory = use('Factory')
const MarketingReportYear = use('App/Models/MarketingReportYear')

class MarketingReportYearSeeder {
  async run () {
    await MarketingReportYear.truncate()
    await Factory
      .model('App/Models/MarketingReportYear')
      .createMany(3)
  }
}

module.exports = MarketingReportYearSeeder
