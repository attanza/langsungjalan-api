'use strict'

const Model = use('Model')

class StudyName extends Model {
  studyPrograms() {
    return this.hasMany('App/Models/StudyProgram')
  }
}

module.exports = StudyName
