'use strict'

const Model = use('Model')

class StudyProgram extends Model {
  university() {
    return this.belongsTo('App/Models/University')
  }

  studyName() {
    return this.belongsTo('App/Models/StudyName')
  }

  years() {
    return this.hasMany('App/Models/StudyYear')
  }

  targets() {
    return this.hasMany('App/Models/MarketingTarget')
  }
}

module.exports = StudyProgram
