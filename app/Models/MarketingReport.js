'use strict'

const Model = use('Model')

class MarketingReport extends Model {
  static get dates() {
    return super.dates.concat(['schedulle_date'])
  }

  schedulle() {
    return this.belongsTo('App/Models/Schedulle')
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
