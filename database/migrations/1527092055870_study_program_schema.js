'use strict'

const Schema = use('Schema')

class StudyProgramSchema extends Schema {
  up () {
    this.create('study_programs', (table) => {
      table.increments()
      table.integer('university_id').unsigned()
      table.string('name', 50).notNullable()
      table.text('address').nullable()
      table.string('email', 150).unique()
      table.string('phone', 30).unique()
      table.string('contact_person', 50).notNullable()
      table.string('description', 250).nullable()
      table.string('year').notNullable()
      table.integer('class_per_year').notNullable()
      table.integer('students_per_class').notNullable()
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
year
class_per_year
students_per_class
lat
lng
*/
