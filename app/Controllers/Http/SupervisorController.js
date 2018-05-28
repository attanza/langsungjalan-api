'use strict'

const User = use('App/Models/User')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')

class SupervisorController {
  async assignMarketing({ request, response, auth }) {
    const {supervisor_id, marketings} = request.only(['supervisor_id', 'marketings'])
    const supervisor = await User.find(supervisor_id)
    if (!supervisor) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await supervisor.marketings().detach()
    await supervisor.marketings().attach(marketings)
    const activity = 'Attaching Marktings to Supervisor'
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete(`User_${supervisor_id}`)
    return response.status(200).send(ResponseParser.successResponse('Marketing attached'))
  }
}

module.exports = SupervisorController
