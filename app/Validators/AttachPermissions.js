"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class AttachPermissions {
  get rules() {
    return {
      role_id: "required|integer",
      permissions: "array",
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

module.exports = AttachPermissions
