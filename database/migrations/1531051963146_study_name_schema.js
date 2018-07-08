'use strict'

const Schema = use('Schema')

/**
 * Study Name Schema
 * name
 * description
 */

class StudyNameSchema extends Schema {
  up () {
    this.create('study_names', (table) => {
      table.increments()
      table.string('name', 50).notNullable()
      table.string('description', 250)
      table.timestamps()
    })
  }

  down () {
    this.drop('study_names')
  }
}

module.exports = StudyNameSchema
