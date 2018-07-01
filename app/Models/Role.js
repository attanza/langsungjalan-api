'use strict'

const Model = use('Model')

class Role extends Model {
  static get hidden () {
    return ['permissions', 'created_at', 'updated_at', 'slug']
  }

  permissions() {
    return this.belongsToMany('App/Models/Permission')
  }
}

module.exports = Role
