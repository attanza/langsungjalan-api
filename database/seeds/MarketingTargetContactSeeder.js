'use strict'


// const Factory = use('Factory')
const MarketingTargetContact = use('App/Models/MarketingTargetContact')

class MarketingTargetContactSeeder {
  async run() {
    await MarketingTargetContact.truncate()
    // await Factory
    //   .model('App/Models/MarketingTargetContact')
    //   .createMany(3)
  }
}

module.exports = MarketingTargetContactSeeder
