'use strict'

const Schema = use('Schema')

class MarketingTargetSchema extends Schema {
  up () {
    this.create('marketing_targets', (table) => {
      table.increments()
      table.string('code').notNullable().unique().index()
      table.integer('study_program_id').unsigned()
      table.string('description')
      table.timestamps()
    })
  }

  down () {
    this.drop('marketing_targets')
  }
}

module.exports = MarketingTargetSchema
