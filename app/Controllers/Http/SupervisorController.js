'use strict'

const User = use('App/Models/User')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')

class SupervisorController {
  async attachMarketing({ request, response, auth }) {
    const { supervisor_id, marketings } = request.only(['supervisor_id', 'marketings'])
    const supervisor = await User.find(supervisor_id)
    if (!supervisor) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    // await supervisor.marketings().detach()
    await supervisor.marketings().attach(marketings)
    await supervisor.load('marketings')
    const activity = 'Attaching Marktings to Supervisor'
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete(`User_${supervisor_id}`)
    await RedisHelper.delete('Marketing_Combo')
    return response.status(200).send(ResponseParser.successResponse(supervisor, 'Marketing attached'))
  }

  async detachMarketing({ request, response, auth }) {
    const { supervisor_id, marketings } = request.only(['supervisor_id', 'marketings'])
    const supervisor = await User.find(supervisor_id)
    if (!supervisor) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await supervisor.marketings().detach(marketings)
    await supervisor.load('marketings')
    const activity = 'Detach Marktings from Supervisor'
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete(`User_${supervisor_id}`)
    await RedisHelper.delete('Marketing_Combo')
    return response.status(200).send(ResponseParser.successResponse(supervisor, 'Marketing detached'))
  }

  async searchMarketing({ request, response }) {
    const { supervisor_id, search } = request.only(['supervisor_id', 'search'])
    const marketings = await User.query()
      .where('role_id', 4)
      .whereHas('supervisors', (builder) => {
        builder.where('supervisor_id', supervisor_id)
      })
      .where('name', 'like', `%${search}%`)
      .orWhere('email', 'like', `%${search}%`)
      .orWhere('phone', 'like', `%${search}%`)
      .fetch()
    return response.status(200).send(marketings)
  }
}

module.exports = SupervisorController
