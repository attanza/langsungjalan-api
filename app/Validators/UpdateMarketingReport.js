'use strict'
const messages = require('./messages')

class UpdateMarketingReport {
  get rules() {
    const id = this.ctx.params.id

    return {
      code: `max:20|unique:marketing_reports,code,id,${id}`,
      schedulle_id: 'required|integer',
      method: 'string|max:50',
      date: 'date',
      terms: 'string|max:250',
      result: 'string|max:250',
      note: 'string|max:250',
      lat: 'number',
      lng: 'number',
      description: 'string|max:250'
    }
  }

  get messages() {
    return messages
  }

  get sanitizationRules() {
    return {
      code: 'escape',
      schedulle_id: 'toInt',
      method: 'escape',
      date: 'toDate',
      terms: 'escape',
      result: 'escape',
      description: 'escape',
      note: 'escape',
    }
  }
}

module.exports = UpdateMarketingReport
