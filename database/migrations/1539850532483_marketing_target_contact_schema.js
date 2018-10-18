'use strict'

const Schema = use('Schema')

class MarketingTargetContactSchema extends Schema {
  up () {
    this.create('marketing_target_contacts', (table) => {
      table.increments()
      table
        .integer('marketing_target_id')
        .unsigned()
        .index()
      table.string('name').notNullable()
      table.string('title')
      table.string('phone').index()
      table.string('email').index()
      table.timestamps()
    })
  }

  down () {
    this.drop('marketing_target_contacts')
  }
}

module.exports = MarketingTargetContactSchema
