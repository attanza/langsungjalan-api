"use strict"

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema")

class ErrorLogSchema extends Schema {
  up() {
    this.create("error_logs", table => {
      table.increments()
      table.string("url")
      table.string("method")
      table.text("error")
      table.string("solve_by")
      table.dateTime("solved_at")
      table.text("action_to_solve")
      table.timestamps()
    })
  }

  down() {
    this.drop("error_logs")
  }
}

module.exports = ErrorLogSchema
