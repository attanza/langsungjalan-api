'use strict'

// const Factory = use('Factory')
const StudyProgram = use('App/Models/StudyProgram')

class StudyProgramSeeder {
  async run () {
    await StudyProgram.truncate()
    // await Factory
    //   .model('App/Models/StudyProgram')
    //   .createMany(3)
    const studies = [
      {
        university_id: 1,
        study_name_id: 1,
        email: 'info_manajemen@bakrie.ac.id',
        phone: '(021) 526 1449',
        address: 'Jl.H.R Rasuna Said Kav C-22, Kuningan Jakarta',
        contact_person: 'Bakrie',
        description: '',
        lat: -6.221632,
        lng: 106.832965
      },
      {
        university_id: 1,
        study_name_id: 2,
        email: 'info_akuntansi@bakrie.ac.id',
        phone: '(021) 526 1450',
        address: 'Jl.H.R Rasuna Said Kav C-22, Kuningan Jakarta',
        contact_person: 'Bakrie',
        description: '',
        lat: -6.221632,
        lng: 106.832965
      },
      {
        university_id: 1,
        study_name_id: 3,
        email: 'info_ilmu_komunikasi@bakrie.ac.id',
        phone: '(021) 526 1451',
        address: 'Jl.H.R Rasuna Said Kav C-22, Kuningan Jakarta',
        contact_person: 'Bakrie',
        description: '',
        lat: -6.221632,
        lng: 106.832965
      }
    ]

    studies.map(async(study) => {
      await StudyProgram.create(study)
    })
  }
}

module.exports = StudyProgramSeeder

// university_id: faker.integer({ min: 1, max: 3 }),
// study_name_id: faker.integer({ min: 1, max: 3 }),
// email: faker.email(),
// phone: faker.phone(),
// address: faker.address(),
// contact_person: faker.name(),
// description: faker.sentence(),
// lat: faker.latitude(),
// lng: faker.longitude(),
