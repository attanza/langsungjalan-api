'use strict'

const Model = use('Model')

class TargetYear extends Model {
  target() {
    return this.belongsTo('App/Models/MarketingTarget')
  }
}

module.exports = TargetYear
