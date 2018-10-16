'use strict'

const { ResponseParser } = use('App/Helpers')
const messages = require('./messages')

class StoreSchedulle {
  get rules () {
    return {
      code: 'alpha_numeric|unique:schedulles',
      marketing_id: 'required|integer',
      marketing_action_id: 'required|integer',
      marketing_target_id: 'required|integer',
      date: 'required|date',
      description: 'max:250'
    }
  }

  get messages() {
    return messages
  }

  get sanitizationRules () {
    return {
      marketing_id: 'toInt',
      marketing_target_id: 'toInt',
      marketing_action_id: 'toInt',
      date: 'toDate',
      description: 'escape',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreSchedulle
