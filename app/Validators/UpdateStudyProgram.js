"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class UpdateStudyProgram {
  get rules() {
    const id = this.ctx.params.id

    return {
      university_id: "required|integer",
      study_name_id: "required|integer",
      email: `required|email|unique:study_programs,email,id,${id}`,
      phone: `required|max:30|unique:study_programs,phone,id,${id}`,
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

module.exports = UpdateStudyProgram
