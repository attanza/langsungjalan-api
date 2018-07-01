'use strict'

const { Slug } = use('App/Helpers')
const Role = use('App/Models/Role')
const Database = use('Database')

class RoleSeeder {
  async run() {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;')

    await Role.truncate()
    const roles = ['Super Administrator', 'Administrator', 'Supervisor', 'Marketing', 'Student']
    roles.forEach(async(role) => {
      await Role.create({
        name: role,
        slug: Slug(role)
      })
    })

  }
}

module.exports = RoleSeeder
