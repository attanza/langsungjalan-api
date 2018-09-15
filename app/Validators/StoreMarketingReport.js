'use strict'

class StoreMarketingReport {
  get rules() {
    return {
      marketing_id: 'required|integer',
      schedulle_id: 'required|integer',
      marketing_action_id: 'required|integer',
      method: 'string|max:50',
      contact_person: 'string|max:50',
      contact_person_phone: 'string|max:30',
      count_year: 'integer',
      count_class: 'integer',
      average_students: 'integer',
      count_attendances: 'integer',
      count_student_dps: 'integer',
      count_shared_packages: 'integer',
      count_orders: 'integer',
      count_cancel_order: 'integer',
      count_dps: 'integer',
      count_payments: 'integer',
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
      marketing_id: 'toInt',
      schedulle_id: 'toInt',
      marketing_action_id: 'toInt',
      method: 'escape',
      contact_person: 'escape',
      contact_person_phone: 'escape',
      count_year: 'toInt',
      count_class: 'toInt',
      average_students: 'toInt',
      count_attendances: 'toInt',
      count_student_dps: 'toInt',
      count_shared_packages: 'toInt',
      count_orders: 'toInt',
      count_cancel_order: 'toInt',
      count_dps: 'toInt',
      count_payments: 'toInt',
      terms: 'escape',
      result: 'escape',
      description: 'escape',
    }
  }
}

module.exports = StoreMarketingReport
