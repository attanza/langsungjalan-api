"use strict"

const Schema = use("Schema")

class StudyProgramSchema extends Schema {
  up() {
    this.create("study_programs", table => {
      table.increments()
      table
        .integer("university_id")
        .unsigned()
        .index()
      table
        .integer("study_name_id")
        .unsigned()
        .index()
      table.text("address").nullable()
      table.string("email", 150)
      table.string("phone", 30)
      table.string("contact_person", 50).notNullable()
      table.string("description", 250).nullable()
      table.float("lat", 10, 6).default(-6.17511)
      table.float("lng", 10, 6).default(106.865036)
      table.timestamps()
    })
  }

  down() {
    this.drop("study_programs")
  }
}

module.exports = StudyProgramSchema
