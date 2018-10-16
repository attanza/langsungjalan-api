'use strict'

const { ResponseParser } = use('App/Helpers')
const messages = require('./messages')


class UpdateContactPerson {
  get rules() {
    const id = this.ctx.params.id

    return {
      name: 'required|max:50',
      title: 'required|max:50',
      phone: `required|max:50|unique:contact_people,phone,id,${id}`,
      email: `required|email|unique:contact_people,email,id,${id}`,
      marketing_target_id: 'required|integer'
    }
  }

  get messages() {
    return messages

  }

  get sanitizationRules () {
    return {
      name: 'escape',
      title: 'escape',
      phone: 'escape',
      email: 'escape',
      marketing_target_id: 'toInt',

    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = UpdateContactPerson
