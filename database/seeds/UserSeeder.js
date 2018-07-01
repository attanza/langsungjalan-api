'use strict'

const Factory = use('Factory')
const User = use('App/Models/User')
const Database = use('Database')
const moment = require('moment')
const randomstring = require('randomstring')
const now = moment().format('YYYY-MM-DD HH:mm:ss')
const roles = ['Super Administrator', 'Administrator', 'Supervisor', 'Marketing', 'Student']
const changeCase = require('change-case')


class UserSeeder {
  async run() {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;')
    await Database.table('users').truncate()
    await Database.table('tokens').truncate()
    await Database.table('activations').truncate()
    await Database.table('marketing_supervisor').truncate()
    await Database.table('role_user').truncate()

    await User.truncate()
    let i = 1
    roles.forEach(async (r) => {
      let userData = {
        name: r,
        email: changeCase.snakeCase(r) + '@langsungjalan.com',
        password: 'P4sw0rd@langsungjalan.com',
        phone: '123456789',
        is_active: 1,
      }
      let user = await User.create(userData)
      await user.roles().attach(i)
      i++
    })
    // await Factory
    //   .model('App/Models/User')
    //   .createMany(15)
    await this.setActivation()
  }

  async setActivation() {
    for (let i = 1; i <= roles.length; i++) {
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

  getDefaultUser() {
    return [
      {
        name: 'Super Administrator',
        email: 'superadmin@langsungjalan.com',
        password: 'password',
        phone: faker.phone(),
        address: faker.address(),
        is_active: 1,
        role_id: faker.integer({ min: 1, max: 5 })
      },
      {
        name: 'Administrator',
        email: 'admin@langsungjalan.com',
        password: 'password',
        phone: faker.phone(),
        address: faker.address(),
        is_active: 1,
        role_id: faker.integer({ min: 1, max: 5 })
      },
      {
        name: 'Super Administrator',
        email: 'superadmin@langsungjalan.com',
        password: 'password',
        phone: faker.phone(),
        address: faker.address(),
        is_active: 1,
        role_id: faker.integer({ min: 1, max: 5 })
      }
    ]
  }
}

module.exports = UserSeeder
