'use strict'

const Model = use('Model')
const Env = use('Env')
class User extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     *
     * Look at `app/Models/Hooks/User.js` file to
     * check the hashPassword method
     */
    this.addHook('beforeCreate', 'User.hashPassword')
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  static get hidden() {
    return ['password', 'verification_token']
  }

  role() {
    return this.belongsTo('App/Models/Role')
  }

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
