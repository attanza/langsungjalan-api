"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class StoreStudyProgram {
  get rules() {
    return {
      university_id: "required|integer",
      study_name_id: "required|integer",
      email: "email",
      phone: "max:30",
      description: "max:250",
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
      phone: "trim|escape",
      contact_person: "trim|escape",
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

module.exports = StoreStudyProgram
