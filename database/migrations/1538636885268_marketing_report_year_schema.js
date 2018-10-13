'use strict'

const Schema = use('Schema')

class MarketingReportYearSchema extends Schema {
  up () {
    this.create('marketing_report_years', (table) => {
      table.increments()
      table.integer('marketing_report_id').unsigned().index()
      table.string('year').notNullable()
      table.integer('class').notNullable()
      table.integer('students').notNullable()
      table.integer('count_attendence')
      table.integer('people_dp')
      table.integer('count_dp')
      table.integer('count_add')
      table.integer('count_cancel')
      table.integer('count_packages')
      table.timestamps()
    })
  }

  down () {
    this.drop('marketing_report_years')
  }
}

module.exports = MarketingReportYearSchema

