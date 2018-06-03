'use strict'

const { ResponseParser } = use('App/Helpers')

class StoreStudyProgram {
  get rules () {
    return {
      university_id: 'required|integer',
      name: 'required|max:50|unique:universities',
      email: 'required|email|unique:universities',
      phone: 'required|max:30|unique:universities',
      year: 'required|min:4|max:5',
      class_per_year: 'required|integer',
      students_per_class:'required|integer',
      lat: 'number',
      lng: 'number'
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      email: '{{ field }} is not a valid email',
      unique: '{{ field }} is already registered',
      max: '{{ field }} cannot more then {{ arguments:0 }} characters'
    }
  }

  get sanitizationRules () {
    return {
      email: 'normalize_email',
      name: 'escape',
      phone: 'escape',
      contact_person: 'escape',
      address: 'escape',
      description: 'escape',
      class_per_year: 'toInt',
      students_per_class: 'toInt',

    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreStudyProgram
