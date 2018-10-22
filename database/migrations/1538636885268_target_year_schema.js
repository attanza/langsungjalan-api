'use strict'

const Schema = use('Schema')

class TargetYearSchema extends Schema {
  up () {
    this.create('target_years', (table) => {
      table.increments()
      table.integer('marketing_target_id').unsigned().index()
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
    this.drop('target_years')
  }
}

module.exports = TargetYearSchema

