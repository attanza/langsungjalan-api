'use strict'

const Factory = use('Factory')
const Schedulle = use('App/Models/Schedulle')

class SchedulleSeeder {
  async run () {
    await Schedulle.truncate()
    await Factory
      .model('App/Models/Schedulle')
      .createMany(25)
  }
}

module.exports = SchedulleSeeder
