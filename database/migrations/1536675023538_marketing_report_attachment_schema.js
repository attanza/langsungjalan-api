'use strict'

const Schema = use('Schema')

class MarketingReportAttachmentSchema extends Schema {
  up () {
    this.create('marketing_report_attachments', (table) => {
      table.increments()
      table.integer('marketing_target_id').unsigned().index()
      table.string('url')
      table.string('caption')
      table.string('tags')
      table.timestamps()
    })
  }

  down () {
    this.drop('marketing_report_attachments')
  }
}

module.exports = MarketingReportAttachmentSchema
