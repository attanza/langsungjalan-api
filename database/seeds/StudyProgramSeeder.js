'use strict'

/*
|--------------------------------------------------------------------------
| StudyProgramSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')
const StudyProgram = use('App/Models/StudyProgram')

class StudyProgramSeeder {
  async run () {
    await StudyProgram.truncate()
    await Factory
      .model('App/Models/StudyProgram')
      .createMany(25)
  }
}

module.exports = StudyProgramSeeder
