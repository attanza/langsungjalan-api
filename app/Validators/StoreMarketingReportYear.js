'use strict'

const {
  ResponseParser
} = use('App/Helpers')
const messages = require('./messages')

class StoreMarketingReportYear {
  get rules() {
    return {
      year: 'required|max:5',
      class: 'required|integer',
      students: 'required|integer',
      marketing_target_id: 'required|integer',
      count_attendence: 'integer',
      people_dp: 'integer',
      count_dp: 'integer',
      count_add: 'integer',
      count_cancel: 'integer',
      count_packages: 'integer',
    }
  }

  get messages() {
    return messages
  }

  get sanitizationRules() {
    return {
      year: 'escape',
      class: 'toInt',
      students: 'toInt',
      marketing_target_id: 'toInt',
      count_attendence: 'toInt',
      people_dp: 'toInt',
      count_dp: 'toInt',
      count_add: 'toInt',
      count_cancel: 'toInt',
      count_packages: 'toInt',

    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreMarketingReportYear
