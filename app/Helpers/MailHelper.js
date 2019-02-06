"use strict"

const Mail = use("Mail")

const Env = use("Env")

const from = Env.get("MAIL_FROM")

const User = use("App/Models/User")

class MailHelper {
  async getForgotPassword(user) {
    await Mail.send("emails.forgot_password", user, message => {
      message
        .to(user.email)
        .from(from)
        .subject("Forgot Password Request")
    })
  }

  async newDpMail(dp) {
    let users = await User.query()
      .whereHas("roles", builder => {
        return builder.where("slug", "supervisor")
      })
      .where("is_active", 1)
      .fetch()
    users = users.toJSON()

    let supervisor = ""
    users.map(u => {
      supervisor += u.email + ";"
    })

    Mail.send("emails.new_dp", dp, message => {
      message
        .to(supervisor)
        .from(from)
        .subject("Pembayaran DP Baru")
    })
  }

  async sendError(subject, e) {
    const data = { e }
    Mail.send("emails.errors_mail", data, message => {
      message
        .to("dani.lesmiadi@gmail.com")
        .from(from)
        .subject(subject)
    })
  }
}

module.exports = new MailHelper()
