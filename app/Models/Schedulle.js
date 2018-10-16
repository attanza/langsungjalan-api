'use strict'

const Model = use('Model')

class Schedulle extends Model {
  static get dates() {
    return super.dates.concat(['date'])
  }

  marketing() {
    return this.belongsTo('App/Models/User', 'marketing_id')
  }

  target() {
    return this.belongsTo('App/Models/MarketingTarget')
  }

  action() {
    return this.belongsTo('App/Models/MarketingAction')
  }

  report() {
    return this.hasOne('App/Models/MarketingReport')
  }
}

module.exports = Schedulle
