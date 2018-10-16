'use strict'

const Model = use('Model')

class MarketingReportYear extends Model {
  target() {
    return this.belongsTo('App/Models/MarketingTarget')
  }
}

module.exports = MarketingReportYear
