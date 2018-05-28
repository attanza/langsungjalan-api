'use strict'

class StoreSchedule {
  get rules () {
    return {
      marketing_id: 'required|integer',
      action: 'required|max:250',
      study_id: 'required|integer',
      start_date: 'required|date',
      end_date: 'required|date',
      description: 'max:250'
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      max: '{{ field }} cannot more then {{ arguments:0 }} characters',
      date: '{{ field }} is not a valid date format'
    }
  }

  get sanitizationRules () {
    return {
      marketing_id: 'toInt',
      action: 'escape',
      study_id: 'toInt',
      start_date: 'toDate',
      end_date: 'toDate',
      description: 'escape',
    }
  }
}

module.exports = StoreSchedule
