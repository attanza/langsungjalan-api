'use strict'

// const Factory = use('Factory')

const MarketingReport = use('App/Models/MarketingReport')

class MarketingReportSeeder {
  async run() {
    await MarketingReport.truncate()
    // await Factory
    //   .model('App/Models/MarketingReport')
    //   .createMany(3)
  }
}

module.exports = MarketingReportSeeder
