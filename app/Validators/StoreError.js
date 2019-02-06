"use strict"

const messages = require("./messages")
const { ResponseParser } = use("App/Helpers")

class StoreError {
  get rules() {
    return {
      from: "url|string",
      method: "required|string|max:10",
      error: "required|string",
      solve_by: "string|max:50",
      action_to_solve: "string",
      error: "string",
    }
  }

  get messages() {
    return messages
  }

  get sanitizationRules() {
    return {
      from: "trim|escape",
      resource: "trim|escape",
      action: "trim|escape",
      solve_by: "trim|escape",
    }
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreError
