'use strict'

const { ResponseParser } = use('App/Helpers')


class AddMarketing {
  get rules () {
    return {
      supervisor_id: 'required|integer',
      marketings: 'required|array',
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      array: '{{ field }} should be array of integers',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = AddMarketing
