'use strict'

const { ResponseParser } = use('App/Helpers')

class StoreStudyProgram {
  get rules () {
    return {
      study_program_id: 'required|integer',
      year: 'required|max:5',
      class_per_year: 'required|integer',
      students_per_class: 'required|integer'
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      integer: '{{ field }} should be integer value',
    }
  }

  get sanitizationRules () {
    return {
      study_program_id: 'to_int',
      year: 'escape',
      class_per_year: 'to_int',
      students_per_class: 'to_int'
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreStudyProgram
