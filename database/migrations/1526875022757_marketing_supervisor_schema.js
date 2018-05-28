'use strict'

const Schema = use('Schema')

class MarketingSupervisorSchema extends Schema {
  up () {
    this.create('marketing_supervisor', (table) => {
      table.increments()
      table.integer('supervisor_id').unsigned()
      table.integer('marketing_id').unsigned()
    })
  }

  down () {
    this.drop('marketing_supervisor')
  }
}

module.exports = MarketingSupervisorSchema
