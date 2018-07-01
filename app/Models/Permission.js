'use strict'

const Model = use('Model')

class Permission extends Model {
  roles() {
    return this.belongsToMany('App/Models/Role')
  }
}

module.exports = Permission
