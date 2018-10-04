'use strict'

const Model = use('Model')

class MarketingReport extends Model {
  static get dates() {
    return super.dates.concat(['schedulle_date'])
  }

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

  contacts() {
    return this.hasMany('App/Models/ContactPerson')
  }

  years() {
    return this.hasMany('App/Models/MarketingReportYear')
  }
}

module.exports = MarketingReport
