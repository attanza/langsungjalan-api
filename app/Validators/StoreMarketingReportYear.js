'use strict'

const { ResponseParser } = use('App/Helpers')


class StoreMarketingReportYear {
  get rules() {
    return {
      year: 'required|max:5',
      class: 'required|integer',
      students: 'required|integer',
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
      year: 'escape',
      class: 'toInt',
      students: 'toInt',
      marketing_report_id: 'toInt',

    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreMarketingReportYear
