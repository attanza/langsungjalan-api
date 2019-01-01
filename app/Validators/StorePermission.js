"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class StorePermission {
  get rules() {
    return {
      name: "required|max:50|unique:permissions",
      description: "max:250",
    }
  }

  get messages() {
    return messages
  }

  get sanitizationRules() {
    return {
      name: "escape",
      slug: "escape",
      description: "escape",
    }
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StorePermission
