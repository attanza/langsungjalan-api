'use strict'

const Model = use('Model')

class Schedulle extends Model {

  static get dates() {
    return super.dates.concat(['start_date', 'end_date'])
  }

  marketing() {
    return this.belongsTo('App/Models/User', 'marketing_id')
  }

  study() {
    return this.belongsTo('App/Models/StudyProgram', 'study_id')
  }

  target() {
    return this.belongsTo('App/Models/MarketingTarget', 'study_id')
  }

  action() {
    return this.belongsTo('App/Models/MarketingAction')
  }

  report() {
    return this.hasOne('App/Models/MarketingReport')
  }
}

module.exports = Schedulle
