'use strict'

const Schema = use('Schema')

class MarketingSupervisorSchema extends Schema {
  up () {
    this.create('marketing_supervisor', (table) => {
      table.increments()
      table.integer('supervisor_id').notNullable().unsigned().index()
      table.integer('marketing_id').notNullable().unsigned().index()
    })
  }

  down () {
    this.drop('marketing_supervisor')
  }
}

module.exports = MarketingSupervisorSchema
