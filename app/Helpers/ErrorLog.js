const Env = use("Env")
const ErrorLog = use("App/Models/ErrorLog")
const MailHelper = require("./MailHelper")
module.exports = async (data, e) => {
  const NODE_ENV = Env.get("NODE_ENV")
  if (NODE_ENV === "development") {
    const dataSplit = data.split(".")
    await ErrorLog.create({
      from: dataSplit[0],
      resource: dataSplit[1],
      action: dataSplit[2],
      error: e.message,
    })
    MailHelper.sendError(data, e)
  }
}
