'use strict'

const { ResponseParser } = use('App/Helpers')
const messages = require('./messages')

class StoreMarketingReportYear {
  get rules() {
    return {
      year: 'required|max:5',
      class: 'required|integer',
      students: 'required|integer',
      marketing_target_id: 'required|integer'
    }
  }

  get messages() {
    return messages
  }

  get sanitizationRules () {
    return {
      year: 'escape',
      class: 'toInt',
      students: 'toInt',
      marketing_target_id: 'toInt',

    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreMarketingReportYear
