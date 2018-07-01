'use strict'

const Database = use('Database')
const Role = use('App/Models/Role')

class PermissionRoleSeeder {
  async run() {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;')
    await Database.table('permission_role').truncate()
    const roles = await Role.all()
    if (roles) {
      const roleData = roles.toJSON()
      roleData.forEach(async (r) => {
        for (let i = 1; i < 29; i++) {
          await Database.table('permission_role').insert({
            role_id: r.id,
            permission_id: i
          })
        }
      })
    }
  }
}

module.exports = PermissionRoleSeeder
