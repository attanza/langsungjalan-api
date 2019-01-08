'use strict'

// const Factory = use('Factory')
const TargetYear = use('App/Models/TargetYear')

class TargetYearSeeder {
  async run() {
    await TargetYear.truncate()
    // await Factory
    //   .model('App/Models/TargetYear')
    //   .createMany(3)
  }
}

module.exports = TargetYearSeeder
