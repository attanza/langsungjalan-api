'use strict'

const Factory = use('Factory')
const MarketingAction = use('App/Models/MarketingAction')

class MarketingActionSeeder {
  async run () {
    await MarketingAction.truncate()
    await Factory
      .model('App/Models/MarketingAction')
      .createMany(25)
  }
}

module.exports = MarketingActionSeeder
