"use strict"

const Schema = use("Schema")

class UniversitySchema extends Schema {
  up() {
    this.create("universities", table => {
      table.increments()
      table.string("name", 50).notNullable()
      table.text("address").nullable()
      table.string("email", 150)
      table.string("phone", 30)
      table.string("contact_person", 50).notNullable()
      table.string("description", 250).nullable()
      table.string("province", 50).notNullable()
      table.string("city", 50).notNullable()
      table.float("lat", 10, 6).default(-6.17511)
      table.float("lng", 10, 6).default(106.865036)
      table.timestamps()
    })
  }

  down() {
    this.drop("universities")
  }
}

module.exports = UniversitySchema
