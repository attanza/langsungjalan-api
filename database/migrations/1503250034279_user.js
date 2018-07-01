'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('email', 200).notNullable().unique()
      table.string('phone', 30).notNullable()
      table.string('password', 60).notNullable()
      table.string('description').nullable()
      table.string('photo').nullable()
      table.text('address').nullable()
      table.boolean('is_active').default(0)
      table.string('verification_token').nullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema

// name
// email
// phone
// password
// description
// photo
// Address
// role_id
// is_active
