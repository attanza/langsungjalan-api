"use strict"

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema")

class DownPaymentSchema extends Schema {
  up() {
    this.create("down_payments", table => {
      table.increments()
      table.integer("marketing_target_id").unsigned()
      table.integer("verified_by").unsigned()
      table.string("transaction_no", 50)
      table.string("name", 50)
      table.string("phone", 50)
      table.integer("dp")
      table.dateTime("verified_at")
      table.timestamps()
    })
  }

  down() {
    this.drop("down_payments")
  }
}

module.exports = DownPaymentSchema
