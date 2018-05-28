'use strict'

const Factory = use('Factory')
const Schedule = use('App/Models/Schedule')

class ScheduleSeeder {
  async run () {
    await Schedule.truncate()
    await Factory
      .model('App/Models/Schedule')
      .createMany(25)
  }
}

module.exports = ScheduleSeeder
