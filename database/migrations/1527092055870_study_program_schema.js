'use strict'

const Schema = use('Schema')

class StudyProgramSchema extends Schema {
  up () {
    this.create('study_programs', (table) => {
      table.increments()
      table.integer('university_id').unsigned()
      table.integer('study_name_id').unsigned()
      table.text('address').nullable()
      table.string('email', 150).unique()
      table.string('phone', 30).unique()
      table.string('contact_person', 50).notNullable()
      table.string('description', 250).nullable()
      table.float('lat', 10, 6).nullable()
      table.float('lng', 10, 6).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('study_programs')
  }
}

module.exports = StudyProgramSchema

/*
university_id
name
address
email
phone
contact_person
description
lat
lng
*/
