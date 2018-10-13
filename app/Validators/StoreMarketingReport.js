'use strict'

class StoreMarketingReport {
  get rules() {
    return {
      schedulle_id: 'required|integer',
      method: 'string|max:50',
      schedulle_date: 'date',
      terms: 'string',
      result: 'string',
      lat: 'number',
      lng: 'number',
      description: 'string'
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
      schedulle_id: 'toInt',
      method: 'escape',
      schedulle_date: 'toDate',
      terms: 'escape',
      result: 'escape',
      description: 'escape',
    }
  }
}

module.exports = StoreMarketingReport
