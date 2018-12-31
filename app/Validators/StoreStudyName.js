"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class StoreStudyName {
  get rules() {
    return {
      name: "required|max:50|unique:study_names",
      description: "max:250",
    }
  }

  get messages() {
    return messages
  }

  get sanitizationRules() {
    return {
      name: "escape",
      description: "escape",
    }
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreStudyName
