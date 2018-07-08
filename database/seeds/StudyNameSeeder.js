'use strict'

const Factory = use('Factory')
const StudyName = use('App/Models/StudyName')

class StudyNameSeeder {
  async run () {
    await StudyName.truncate()
    await Factory
      .model('App/Models/StudyName')
      .createMany(25)
  }
}

module.exports = StudyNameSeeder
