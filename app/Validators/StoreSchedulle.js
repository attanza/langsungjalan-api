'use strict'

const { ResponseParser } = use('App/Helpers')

class StoreSchedulle {
  get rules () {
    return {
      code: 'alpha_numeric|unique:schedulles',
      marketing_id: 'required|integer',
      marketing_action_id: 'required|integer',
      study_program_id: 'required|integer',
      marketing_report_id: 'required|integer',

      date: 'required|date',
      description: 'max:250'
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      max: '{{ field }} cannot more then {{ arguments:0 }} characters',
      date: '{{ field }} is not a valid date format'
    }
  }

  get sanitizationRules () {
    return {
      marketing_id: 'toInt',
      study_program_id: 'toInt',
      marketing_action_id: 'toInt',
      marketing_report_id: 'toInt',
      date: 'toDate',
      description: 'escape',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreSchedulle
