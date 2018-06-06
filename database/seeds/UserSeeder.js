'use strict'

const Factory = use('Factory')
const User = use('App/Models/User')
const Database = use('Database')
const moment = require('moment')
const randomstring = require('randomstring')
const now = moment().format('YYYY-MM-DD HH:mm:ss')

class UserSeeder {
  async run() {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;')
    await Database.table('users').truncate()
    await Database.table('tokens').truncate()
    await Database.table('activations').truncate()
    await Database.table('marketing_supervisor').truncate()

    await User.truncate()
    await Factory
      .model('App/Models/User')
      .createMany(15)
    await this.setActivation()
  }

  async setActivation() {
    for (let i = 1; i < 6; i++) {
      const generatedCode = randomstring.generate({
        length: 40,
        charset: 'hex'
      })

      await Database.table('activations').insert({
        user_id: i,
        code: generatedCode,
        completed: 1,
        completed_at: now,
        created_at: now,
        updated_at: now,
      })

    }
  }
}

module.exports = UserSeeder
