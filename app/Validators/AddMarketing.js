"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class AddMarketing {
  get rules() {
    return {
      supervisor_id: "required|integer",
      marketings: "required|array",
    }
  }

  get messages() {
    return messages
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = AddMarketing
