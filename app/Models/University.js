'use strict'

const Model = use('Model')

class University extends Model {
  studies() {
    return this.hasMany('App/Models/StudyPrograms')
  }
}

module.exports = University
