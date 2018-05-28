'use strict'

const User = use('App/Models/User')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')

class MarketingController {
  async assignSupervisor({ request, response, auth }) {
    const {supervisor_id, marketing_id} = request.only(['supervisor_id', 'marketing_id'])
    const marketing = await User.find(marketing_id)
    if (!marketing_id) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await marketing.supervisors().detach()
    await marketing.supervisors().attach(supervisor_id)
    const activity = 'Attaching Supervisor to Marketing'
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete(`User_${marketing_id}`)
    return response.status(200).send(ResponseParser.successResponse('Supervisor attached'))
  }
}

module.exports = MarketingController
