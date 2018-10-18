'use strict'

const Model = use('Model')

class MarketingReport extends Model {
  static get dates() {
    return super.dates.concat(['date'])
  }

  schedulle() {
    return this.belongsTo('App/Models/Schedulle')
  }
}

module.exports = MarketingReport
