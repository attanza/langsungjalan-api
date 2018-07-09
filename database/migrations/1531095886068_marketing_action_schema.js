'use strict'

const Schema = use('Schema')

class MarketingActionSchema extends Schema {
  up () {
    this.create('marketing_actions', (table) => {
      table.increments()
      table.string('name', 50).notNullable()
      table.string('description', 250)
      table.timestamps()
    })
  }

  down () {
    this.drop('marketing_actions')
  }
}

module.exports = MarketingActionSchema
