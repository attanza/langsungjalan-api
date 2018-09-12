'use strict'

const { ResponseParser } = use('App/Helpers')

class StoreMarketingReportAttachment {
  get rules() {
    return {
      marketing_report_id: 'required',
      caption: 'string|max:50',
      tags: 'string|max:50',
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      integer: '{{ field }} should be integer value',
      max: '{{ field }} cannot more then {{ arguments:0 }} characters',

    }
  }

  get sanitizationRules() {
    return {
      caption: 'escape',
      tags: 'escape',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreMarketingReportAttachment
