'use strict'

const Model = use('Model')
const {RedisHelper} = use('App/Helpers')

class Activity extends Model {
  static boot() {
    super.boot()
    this.addHook('beforeCreate', async () => {
      await RedisHelper.delete('Activity_*')
    })

  }
  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Activity
