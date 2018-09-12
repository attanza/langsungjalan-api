'use strict'

const Factory = use('Factory')
const StudyYear = use('App/Models/StudyYear')


class StudyYearSeeder {
  async run () {
    await StudyYear.truncate()
    await Factory
      .model('App/Models/StudyYear')
      .createMany(3)
  }
}

module.exports = StudyYearSeeder
