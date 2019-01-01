"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class UpdateMarketingTarget {
  get rules() {
    const id = this.ctx.params.id

    return {
      code: `required|max:50|unique:marketing_targets,code,id,${id}`,
      study_program_id: "required|integer",
    }
  }

  get messages() {
    return messages
  }

  get sanitizationRules() {
    return {
      code: "escape",
      study_program_id: "toInt",
    }
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = UpdateMarketingTarget
