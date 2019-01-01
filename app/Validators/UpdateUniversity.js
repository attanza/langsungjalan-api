"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class UpdateUniversity {
  get rules() {
    const id = this.ctx.params.id
    return {
      name: `required|max:50|unique:universities,name,id,${id}`,
      email: `required|email|unique:universities,email,id,${id}`,
      phone: `required|max:30|unique:universities,phone,id,${id}`,
      contact_person: "required|max:50",
      province: "required|max:50",
      city: "required|max:50",
      lat: "number",
      lng: "number",
    }
  }

  get messages() {
    return messages
  }

  get sanitizationRules() {
    return {
      email: "normalize_email",
      name: "escape",
      phone: "escape",
      contact_person: "escape",
      province: "escape",
      city: "escape",
      address: "escape",
      description: "escape",
    }
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = UpdateUniversity
