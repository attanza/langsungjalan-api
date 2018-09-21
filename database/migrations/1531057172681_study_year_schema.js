'use strict'

const Schema = use('Schema')

class StudyYearSchema extends Schema {
  up () {
    this.create('study_years', (table) => {
      table.increments()
      table.integer('study_program_id').unsigned().index()
      table.string('year', 5).notNullable()
      table.integer('class_per_year').notNullable()
      table.integer('students_per_class').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('study_years')
  }
}

module.exports = StudyYearSchema
