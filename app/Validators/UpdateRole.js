"use strict"

const { ResponseParser } = use("App/Helpers")
const messages = require("./messages")

class UpdateRole {
  get rules() {
    const id = this.ctx.params.id

    return {
      name: `required|max:50|unique:roles,name,id,${id}`,
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

module.exports = UpdateRole
