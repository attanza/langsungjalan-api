"use strict"

const { AesUtil, ResponseParser } = use("App/Helpers")
const moment = use("moment")
const Env = use("Env")
class Client {
  async handle({ request, response }, next) {
    const { token } = request.headers()
    const date = request.header("x-dsi-restful")
    if (!date) {
      console.log("no date") //eslint-disable-line
      return response
        .status(401)
        .send(ResponseParser.errorResponse("Unauthorized"))
    }

    if (!checkDate(date)) {
      console.log("date expired") //eslint-disable-line
      return response
        .status(401)
        .send(ResponseParser.errorResponse("Unauthorized"))
    }

    if (!token) {
      console.log("no token") //eslint-disable-line

      return response
        .status(401)
        .send(ResponseParser.errorResponse("Unauthorized"))
    }

    const CLIENT_TOKEN = Env.get("CLIENT_TOKEN")

    const decrypted = AesUtil.decrypt(token, date + CLIENT_TOKEN)
    if (!decrypted) {
      console.log("decrypt failed") //eslint-disable-line

      return response
        .status(400)
        .send(ResponseParser.errorResponse("Unauthorized"))
    }

    let parsedDecrypted = JSON.parse(decrypted)

    if (!checkDate(parsedDecrypted.date)) {
      console.log("decrypted date expired") //eslint-disable-line
      return response
        .status(401)
        .send(ResponseParser.errorResponse("Unauthorized"))
    }

    await next()
  }
}

module.exports = Client

function checkDate(dateData) {
  const now = moment()
  const dateAdded = moment.unix(dateData).add(10, "m")

  if (now > dateAdded) return false
  return true
}
