'use strict'

const { ResponseParser } = use('App/Helpers')
const changeCase = require('change-case')
const User = use('App/Models/User')
const University = use('App/Models/University')
const StudyProgram = use('App/Models/StudyProgram')
const moment = require('moment')

class DataExportController {
  async index({ request, response }) {
    try {
      let { model, sort_by, sort_mode, limit, range_by, range_start, range_end } = request.get()

      if (!sort_by) sort_by = 'id'
      if (!sort_mode) sort_mode = 'asc'
      if (!limit) limit = 100
      if (!range_by) range_by = 'created_at'
      if (!range_start) range_start = moment().add(-1, 'M').format('YYYY-MM-DD HH:mm:ss')
      else range_start = moment(range_start).format('YYYY-MM-DD HH:mm:ss')
      if (!range_end) range_end = moment().format('YYYY-MM-DD HH:mm:ss')
      else range_end = moment(range_end).format('YYYY-MM-DD HH:mm:ss')

      model = changeCase.upperCaseFirst(model)
      let data

      switch (model) {
      case 'User':
        data = await this.getUsers(sort_by, sort_mode, limit, range_by, range_start, range_end)
        break

      case 'University':
        data = await this.getUniversities(sort_by, sort_mode, limit, range_by, range_start, range_end)
        break

      case 'Supervisor':
        data = await this.getSupervisor(sort_by, sort_mode, limit, range_by, range_start, range_end)
        break

      case 'StudyProgram':
        data = await this.getStudyPrograms(sort_by, sort_mode, limit, range_by, range_start, range_end)
        break

      default:
        data = null
        break
      }

      return response.status(200).send(ResponseParser.apiItem(data))
    } catch (error) {
      console.log("error", error); //eslint-disable-line
      return response
        .status(400)
        .send(ResponseParser.errorResponse('Failed to get data'))
    }
  }

  async getUsers(sort_by, sort_mode, limit, range_by, range_start, range_end) {
    let dbData = await User.query()
      .with('roles', builder => {
        builder.select('id', 'name')
      })
      .whereBetween(range_by,[range_start,range_end])
      .orderBy(sort_by, sort_mode)
      .limit(parseInt(limit))
      .fetch()

    dbData = dbData.toJSON()
    let output = []
    dbData.map(d => {
      // Roles Parsing
      let roles = ''
      let data = Object.assign({}, d)
      delete data.roles
      if (d.roles) d.roles.map(role => (roles += role.name + ', '))
      data.roles = roles

      output.push(data)
    })
    return output
  }

  async getUniversities(sort_by, sort_mode, limit, range_by, range_start, range_end) {
    let dbData = await University.query()
      .whereBetween(range_by,[range_start,range_end])
      .orderBy(sort_by, sort_mode)
      .limit(parseInt(limit))
      .fetch()
    return dbData
  }

  async getSupervisor(sort_by, sort_mode, limit, range_by, range_start, range_end) {
    let dbData = await User.query()
      .whereHas('roles', builder => {
        builder.where('slug', 'supervisor')
      })
      .whereBetween(range_by,[range_start,range_end])
      .orderBy(sort_by, sort_mode)
      .limit(parseInt(limit))
      .fetch()
    return dbData
  }

  async getStudyPrograms(sort_by, sort_mode, limit, range_by, range_start, range_end) {
    let dbData = await StudyProgram.query()
      .with('university', builder => {
        builder.select('id', 'name')
      })
      .with('studyName', builder => {
        builder.select('id', 'name')
      })
      .with('years')
      .whereBetween(range_by,[range_start,range_end])
      .orderBy(sort_by, sort_mode)
      .limit(parseInt(limit))
      .fetch()

      // "id": 2,
      // "study_program_id": 1,
      // "year": "2019",
      // "class_per_year": 12,
      // "students_per_class": 25,

    dbData = dbData.toJSON()
    let output = []
    dbData.map(d => {
      // Relation ship Parsing
      let university = ''
      let studyName = ''
      let data = Object.assign({}, d)
      delete data.university
      delete data.studyName

      if (d.university) university = d.university.name
      if (d.studyName) studyName = d.studyName.name

      data.university = university
      data.studyName = studyName
      output.push(data)
    })
    return output
  }
}

module.exports = DataExportController
