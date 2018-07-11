'use strict'

const { ResponseParser } = use('App/Helpers')

class StoreSchedulle {
  get rules () {
    return {
      marketing_id: 'required|integer',
      marketing_action_id: 'required|integer',
      study_id: 'required|integer',
      start_date: 'required|date',
      end_date: 'required|date',
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
      study_id: 'toInt',
      marketing_action_id: 'toInt',
      start_date: 'toDate',
      end_date: 'toDate',
      description: 'escape',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreSchedulle
