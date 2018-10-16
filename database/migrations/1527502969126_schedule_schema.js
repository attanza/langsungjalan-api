'use strict'

const Schema = use('Schema')

class ScheduleSchema extends Schema {
  up () {
    this.create('schedulles', (table) => {
      table.increments()
      table.integer('marketing_target_id').unsigned().index()
      table.string('code', 20).notNullable().index()
      table.integer('marketing_id').unsigned().index()
      table.integer('marketing_action_id').unsigned().index()
      table.dateTime('date').notNullable()
      table.string('description').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('schedulles')
  }
}

module.exports = ScheduleSchema
