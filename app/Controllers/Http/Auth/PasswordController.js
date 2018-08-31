'use strict'

const User = use('App/Models/User')
const { ResponseParser, MailHelper } = use('App/Helpers')
const crypto = use('crypto')
const uuid = use('uuid')
const ForgotPassword = use('App/Models/ForgotPassword')

class PasswordController {

  async getForgot({ request, response }) {
    const { email } = request.post()
    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    if (!user.is_active) {
      return response.status(400).send(ResponseParser.errorResponse('This user is not active'))
    }

    let tokenData = await ForgotPassword.create({
      email,
      code: crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    })

    MailHelper.getForgotPassword(tokenData)
    return response.status(200).send(ResponseParser.successResponse(null, 'An email sent to user'))
  }

  async showPasswordForm({ request, view, session }) {
    const { token } = request.get()
    const user = await User.findBy('verification_token', token)
    if (!user) {
      session.withErrors('User not found')
    }
    return view.render('passwords/new_password', { token })
  }

  async postReset({ view }) {
    const msg = 'Your password has successfuly reset.'
    return view.render('passwords/messages', { msg })
  }
}

module.exports = PasswordController
