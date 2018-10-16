'use strict'

const Model = use('Model')

class MarketingTarget extends Model {
  study() {
    return this.belongsTo('App/Models/StudyProgram')
  }
  contacts() {
    return this.hasMany('App/Models/ContactPerson')
  }
}

module.exports = MarketingTarget
