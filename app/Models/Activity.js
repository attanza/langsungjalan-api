'use strict'

const Model = use('Model')

class Activity extends Model {
  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Activity
