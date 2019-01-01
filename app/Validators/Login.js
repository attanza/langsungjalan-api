"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class Login {
  get rules() {
    return {
      email: "required",
      password: "required",
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

module.exports = Login
