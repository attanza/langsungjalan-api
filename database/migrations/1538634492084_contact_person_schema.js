'use strict'

const Schema = use('Schema')

class ContactPersonSchema extends Schema {
  up() {
    this.create('contact_people', table => {
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

  down() {
    this.drop('contact_people')
  }
}

module.exports = ContactPersonSchema
