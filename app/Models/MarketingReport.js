'use strict'

const Model = use('Model')

class MarketingReport extends Model {
  marketing() {
    return this.belongsTo('App/Models/User', 'marketing_id')
  }

  schedulle() {
    return this.belongsTo('App/Models/Schedulle')
  }

  action() {
    return this.belongsTo('App/Models/MarketingAction')
  }

  attachments() {
    return this.hasMany('App/Models/MarketingReportAttachment')
  }
}

module.exports = MarketingReport