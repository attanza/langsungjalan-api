'use strict'

const Model = use('Model')

class Schedule extends Model {

  static get dates () {
    return super.dates.concat(['start_date', 'end_date'])
  }
  
  marketing() {
    return this.belongsTo('App/Models/User', 'marketing_id')
  }

  study() {
    return this.belongsTo('App/Models/StudyProgram', 'study_id')
  }
}

module.exports = Schedule
