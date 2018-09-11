'use strict'

const MarketingReportAttachment = use('App/Models/MarketingReportAttachment')

class MarketingReportAttachmentSeeder {
  async run () {
    await MarketingReportAttachment.truncate()
  }
}

module.exports = MarketingReportAttachmentSeeder
