'use strict'

const { ResponseParser } = use('App/Helpers')

class StoreMarketingAction {
  get rules() {
    return {
      name: 'required|max:50|unique:marketing_actions',
      description: 'max:250'
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      max: '{{ field }} cannot more then {{ arguments:0 }} characters',
    }
  }

  get sanitizationRules() {
    return {
      name: 'escape',
      description: 'escape',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreMarketingAction
