'use strict'

const Model = use('Model')

class StudyYear extends Model {
  studyPrograms() {
    return this.belongsTo('App/Models/StudyProgram')
  }
}

module.exports = StudyYear
