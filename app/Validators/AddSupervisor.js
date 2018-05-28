'use strict'

const { ResponseParser } = use('App/Helpers')


class AddSupervisor {
  get rules () {
    return {
      supervisor_id: 'required|integer',
      marketing_id: 'required|integer',
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = AddSupervisor
