'use strict'

const Schema = use('Schema')

class ScheduleSchema extends Schema {
  up () {
    this.create('schedulles', (table) => {
      table.increments()
      table.string('code', 50).notNullable().index()
      table.integer('marketing_id').unsigned().index()
      table.integer('study_id').unsigned().index()
      table.integer('marketing_action_id').unsigned().index()
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
