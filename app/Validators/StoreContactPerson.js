'use strict'

const { ResponseParser } = use('App/Helpers')

class StoreContactPerson {
  get rules() {
    return {
      name: 'required|max:50',
      title: 'required|max:50',
      phone: 'required|max:50|unique:contact_people',
      email: 'required|email|unique:contact_people',
      marketing_report_id: 'required|integer'
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      max: '{{ field }} cannot more then {{ arguments:0 }} characters',

    }
  }

  get sanitizationRules () {
    return {
      name: 'escape',
      title: 'escape',
      phone: 'escape',
      email: 'escape',
      marketing_report_id: 'toInt',

    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreContactPerson