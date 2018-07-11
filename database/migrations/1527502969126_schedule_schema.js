'use strict'

const Schema = use('Schema')

class ScheduleSchema extends Schema {
  up () {
    this.create('schedulles', (table) => {
      table.increments()
      table.integer('marketing_id').unsigned()
      table.integer('study_id').unsigned()
      table.integer('marketing_action_id').unsigned()
      table.dateTime('start_date').notNullable()
      table.dateTime('end_date').notNullable()
      table.string('description').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('schedulles')
  }
}

module.exports = ScheduleSchema

/*
marketing_id
action
study_id
start_date
end_date
description
*/
