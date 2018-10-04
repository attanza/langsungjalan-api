'use strict'

// const Factory = use('Factory')
const University = use('App/Models/University')

class UniversitySeeder {
  async run () {
    await University.truncate()

    const universities = [
      {
        name: 'Universitas Bakrie',
        email: 'info@bakrie.ac.id',
        phone: '(021) 526 1448',
        address: 'Jl.H.R Rasuna Said Kav C-22, Kuningan Jakarta',
        contact_person: 'Bakrie',
        description: '',
        province: 'DKI Jakarta',
        city: 'Kuningan Jakarta',
        lat: -6.221632,
        lng: 106.832965
      }
    ]

    universities.map(async (university) => {
      await University.create(university)
    })
    // await Factory
    //   .model('App/Models/University')
    //   .createMany(3)
  }
}

module.exports = UniversitySeeder
