'use strict'

// const Factory = use('Factory')
const StudyName = use('App/Models/StudyName')

class StudyNameSeeder {
  async run () {
    await StudyName.truncate()
    // await Factory
    //   .model('App/Models/StudyName')
    //   .createMany(3)
    const names = [
      'Manajemen', 'Akuntansi', 'Ilmu Komunikasi'
    ]

    names.map(async(name) => {
      await StudyName.create({name})
    })
  }
}

module.exports = StudyNameSeeder
