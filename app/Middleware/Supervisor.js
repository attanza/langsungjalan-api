'use strict'

const { ResponseParser } = use('App/Helpers')

class Supervisor {
  async handle({ auth, response }, next) {
    const user = await auth.getUser()
    if (!user) {
      return response.status(401).send(ResponseParser.unauthorizedResponse())
    }
    if (user.role_id > 3) {
      return response.status(403).send(ResponseParser.forbiddenResponse())
    }
    await next()
  }
}

module.exports = Supervisor
