'use strict'

const Model = use('Model')

class Role extends Model {
  static get hidden () {
    return ['permissions', 'created_at', 'updated_at', 'slug']
  }
}

module.exports = Role
