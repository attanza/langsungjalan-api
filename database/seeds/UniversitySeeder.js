'use strict'

/*
|--------------------------------------------------------------------------
| UniversitySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')
const University = use('App/Models/University')

class UniversitySeeder {
  async run () {
    await University.truncate()
    await Factory
      .model('App/Models/University')
      .createMany(3)
  }
}

module.exports = UniversitySeeder
