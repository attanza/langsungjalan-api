'use strict'

const Factory = use('Factory')
const StudyProgram = use('App/Models/StudyProgram')

class StudyProgramSeeder {
  async run () {
    await StudyProgram.truncate()
    await Factory
      .model('App/Models/StudyProgram')
      .createMany(3)
  }
}

module.exports = StudyProgramSeeder
