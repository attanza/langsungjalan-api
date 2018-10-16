'use strict'

const { ResponseParser } = use('App/Helpers')
const messages = require('./messages')

class StoreMarketingTarget {
  get rules() {
    return {
      code: 'required|max:50|unique:marketing_targets',
      study_program_id: 'required|integer',
      description: 'string|max:250'
    }
  }

  get messages() {
    return messages
  }

  get sanitizationRules () {
    return {
      code: 'escape',
      study_program_id: 'toInt',
      description: 'escape',

    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }


}

module.exports = StoreMarketingTarget
