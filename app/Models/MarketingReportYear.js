'use strict'

const Model = use('Model')

class MarketingReportYear extends Model {
  report() {
    return this.belongsTo('App/Models/MarketingReport')
  }
}

module.exports = MarketingReportYear
