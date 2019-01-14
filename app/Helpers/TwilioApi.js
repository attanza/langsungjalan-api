const Env = use("Env")
const twilio = require("twilio")

const accountSid = Env.get("TWILIO_ACCOUNT")
const authToken = Env.get("TWILIO_TOKEN")
const tnumber = Env.get("TWILIO_NUMBER")

function sendSmsMessage(userPhone, body) {
  const client = new twilio(accountSid, authToken)
  client.messages
    .create({
      body,
      to: userPhone,
      from: tnumber,
    })
    .then(message => {
      console.log("------------------------")
      console.log("Sms Api")
      console.log(message.accountSid)
      console.log(message.to)
      console.log(message.body)
      console.log("------------------------")
    })
    .catch(e => console.log(e))
}

module.exports = sendSmsMessage
