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

  action() {
    return this.belongsTo('App/Models/MarketingAction')
  }
}

module.exports = Schedulle
