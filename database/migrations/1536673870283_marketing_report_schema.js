'use strict'

const Schema = use('Schema')

class MarketingReportSchema extends Schema {
  up () {
    this.create('marketing_reports', (table) => {
      table.increments()
      table.integer('marketing_id').unsigned()
      table.integer('schedulle_id').unsigned()
      table.integer('marketing_action_id').unsigned()
      table.string('method', 50)
      table.string('contact_person', 50)
      table.string('contact_person_phone', 30)
      table.integer('count_year')
      table.integer('count_class')
      table.integer('average_students')
      table.integer('count_attendances')
      table.integer('count_student_dps')
      table.integer('count_shared_packages')
      table.integer('count_orders')
      table.integer('count_cancel_order')
      table.integer('count_dps')
      table.integer('count_payments')
      table.dateTime('schedulle')
      table.text('terms')
      table.string('result', 30)
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
