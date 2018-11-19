'use strict'

const Model = use('Model')

class MarketingTarget extends Model {
  study() {
    return this.belongsTo('App/Models/StudyProgram')
  }
  contacts() {
    return this.hasMany('App/Models/ContactPerson')
  }

  schedulles() {
    return this.hasMany('App/Models/Schedulle')
  }
}

module.exports = MarketingTarget
