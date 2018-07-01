'use strict'

const Database = use('Database')

class PermissionRoleSeeder {
  async run() {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;')
    await Database.table('permission_role').truncate()
    await Database.table('role_user').truncate()

    for (let i = 1; i < 29; i++) {
      await Database.table('permission_role').insert({
        role_id: 1,
        permission_id: i
      })
    }
  }
}

module.exports = PermissionRoleSeeder
