'use strict'

const Schema = use('Schema')

class MarketingReportSchema extends Schema {
  up () {
    this.create('marketing_reports', (table) => {
      table.increments()
      table.integer('schedulle_id').unsigned().index()
      table.string('method', 50)
      table.dateTime('schedulle_date')
      table.text('terms')
      table.string('result')
      table.float('lat', 10, 6).default(-6.175110)
      table.float('lng', 10, 6).default(106.865036)
      table.string('description')
      table.timestamps()
    })
  }

  down () {
    this.drop('marketing_reports')
  }
}

module.exports = MarketingReportSchema
