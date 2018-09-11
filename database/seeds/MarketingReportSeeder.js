'use strict'

const MarketingReport = use('App/Models/MarketingReport')

class MarketingReportSeeder {
  async run () {
    await MarketingReport.truncate()
  }
}

module.exports = MarketingReportSeeder
