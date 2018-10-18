'use strict'

const Model = use('Model')

class MarketingTargetContact extends Model {
  target() {
    return this.belongsTo('App/Models/MarketingTarget')
  }
}

module.exports = MarketingTargetContact
