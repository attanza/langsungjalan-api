'use strict'

const Model = use('Model')
const Env = use('Env')
class User extends Model {
  static boot() {
    super.boot()
    this.addHook('beforeCreate', ['User.hashPassword', 'User.generateUid'])

  }

  static get hidden() {
    return ['password', 'verification_token']
  }

  static get traits () {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }

  // roles() {
  //   return this.belongsToMany('App/Models/Role')
  // }

  tokens() {
    return this.hasMany('App/Models/Token')
  }

  getPhoto() {
    if (this.photo) {
      return `${Env.get('APP_URL')}/${this.photo}`
    } else return ''
  }

  supervisors() {
    return this
      .belongsToMany('App/Models/User', 'marketing_id', 'supervisor_id', 'id')
      .pivotTable('marketing_supervisor')
  }

  marketings() {
    return this
      .belongsToMany('App/Models/User', 'supervisor_id', 'marketing_id', 'id')
      .pivotTable('marketing_supervisor')
  }
}

module.exports = User
