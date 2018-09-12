'use strict'

const MarketingAction = use('App/Models/MarketingAction')
const actions = ['Atur Jadwal', 'Presentasi', 'Bagi Paket']

class MarketingActionSeeder {
  async run () {
    await MarketingAction.truncate()
    for (let i = 0; i < actions.length; i++) {
      await MarketingAction.create({
        name: actions[i]
      })
    }
  }
}

module.exports = MarketingActionSeeder


// Atur jadwal, presentasi, bagi paket
