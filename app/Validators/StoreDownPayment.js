"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class StoreDownPayment {
  get rules() {
    return {
      marketing_target_id: "required_if:!data|integer",
      name: "required_if:!data|max:50",
      phone: "required_if:!data|max:50",
      dp: "required_if:!data|integer",
      data: "array",
      "data.*.marketing_target_id": "required_if:data",
      "data.*.name": "required_if:data|max:50",
      "data.*.phone": "required_if:data|max:50",
      "data.*.dp": "required_if:data|integer",
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

module.exports = StoreDownPayment
