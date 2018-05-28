'use strict'

const Model = use('Model')

class Schedule extends Model {
  marketing() {
    return this.belongsTo('App/Models/User', 'marketing_id')
  }

  study() {
    return this.belongsTo('App/Models/StudyProgram', 'study_id')
  }
}

module.exports = Schedule
