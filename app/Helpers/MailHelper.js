'use strict'

const Mail = use('Mail')

const Env = use('Env')

const from = Env.get('MAIL_FROM')

class MailHelper {
  async getForgotPassword(user) {
    const baseUrl = Env.get('APP_URL')
    user.baseUrl = baseUrl
    await Mail.send('emails.forgot_password', user.toJSON(), (message) => {
      message
        .to(user.email)
        .from(from)
        .subject('Forgot Password Request')
    })
  }
}

module.exports = new MailHelper()
