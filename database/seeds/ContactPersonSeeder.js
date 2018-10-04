'use strict'

const Factory = use('Factory')
const ContactPerson = use('App/Models/ContactPerson')

class ContactPersonSeeder {
  async run () {
    await ContactPerson.truncate()
    await Factory
      .model('App/Models/ContactPerson')
      .createMany(3)
  }
}

module.exports = ContactPersonSeeder
