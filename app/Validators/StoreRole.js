"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class StoreRole {
  get rules() {
    return {
      name: "required|max:50|unique:roles",
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

module.exports = StoreRole
