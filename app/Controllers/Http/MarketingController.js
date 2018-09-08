'use strict'

const User = use('App/Models/User')
const Role = use('App/Models/Role')

const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits, ActivationTraits } = use('App/Traits')
const Hash = use('Hash')

const fillable = [
  'name',
  'email',
  'phone',
  'address',
  'description',
  'is_active'
]

class MarketingController {
  /**
   * Index
   * Get List of Marketing
   */
  async index({ request, response }) {
    // TODO fix search with specific condition in user model
    let { page, limit, search, supervisor_id } = request.get()
    if (!page) page = 1
    if (!limit) limit = 10
    if (!search) search = ''

    if(search && supervisor_id) {
      return response
        .status(200)
        .send(await searchWithSupervisor(page, limit, search, supervisor_id))
    }
    else if (search != '') {
      return response
        .status(200)
        .send(await searchMarketing(page, limit, search))
    } else if (supervisor_id) {
      return response
        .status(200)
        .send(await searchBySupervisor(page, limit, supervisor_id))
    } else {
      let redisKey = `Marketing_${page}_${limit}`
      let cached = await RedisHelper.get(redisKey)

      if (cached != null) {
        return response.status(200).send(cached)
      }

      const data = await User.query()
        .whereHas('roles', async (builder) => {
          builder.where('slug', 'marketing')
        })
        .with('supervisors', builder => {
          builder.select('id', 'name')
        })
        .orderBy('name')
        .paginate(parseInt(page), parseInt(limit))
      let parsed = ResponseParser.apiCollection(data.toJSON())

      await RedisHelper.set(redisKey, parsed)

      return response.status(200).send(parsed)
    }
  }

  /**
   * Store
   * Create New Marketing
   */

  async store({ request, response, auth }) {
    let body = request.only(fillable)
    let { password } = request.post()
    body.password = password
    const data = await User.create(body)
    await data.roles().attach(await getMarketingRoleId())
    await ActivationTraits.createAndActivate(data)
    await RedisHelper.delete('Marketing_*')
    await RedisHelper.delete('User_*')
    const activity = `Add new Marketing '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await data.load('supervisors')
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * Get Marketing by ID
   */

  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `Marketing_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }
    const data = await User.query()
      .where('id', id)
      .first()
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.load('supervisors')
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update Marketing data by ID
   */

  async update({ request, response, auth }) {
    const id = request.params.id
    const data = await User.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }

    let body = request.only(fillable)

    await data.merge(body)
    await data.save()
    await data.load('supervisors')
    const activity = `Update Marketing '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Marketing_*')
    await RedisHelper.delete('User_*')
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete Marketing data by ID
   */

  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await User.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const activity = `Delete Marketing '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete('Marketing_*')
    await RedisHelper.delete('User_*')
    // Delete Relationship
    await data.tokens().delete()
    await data.roles().detach()
    await data.supervisors().detach()
    // Delete Data
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }

  /**
   * Change Password
   */
  async changePassword({ request, response }) {
    const { id } = request.params

    const data = await User.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    const { old_password, password } = request.post()
    const isSame = await Hash.verify(old_password, data.password)
    if (!isSame) {
      return response
        .status(400)
        .send(ResponseParser.errorResponse('Old password incorect'))
    }
    const hashPassword = await Hash.make(password)
    await data.merge({ password: hashPassword })
    await data.save()
    return response
      .status(200)
      .send(ResponseParser.successResponse(data, 'Password updated'))
  }
}

module.exports = MarketingController

async function searchMarketing(page, limit, search) {
  const data = await User.query()
    .with('supervisors', builder => {
      builder.select('id', 'name')
    })
    .whereHas('roles', async (builder) => {
      builder.where('slug', 'marketing')
    })
    .where('name', 'like', `%${search}%`)
    .orWhere('email', 'like', `%${search}%`)
    .orWhere('phone', 'like', `%${search}%`)
    .orWhere('address', 'like', `%${search}%`)
    .paginate(parseInt(page), parseInt(limit))
  return ResponseParser.apiCollection(data.toJSON())
}

async function searchWithSupervisor(page, limit, search, supervisor_id) {
  const data = await User.query()
    .with('supervisors', builder => {
      builder.select('id', 'name')
    })
    .whereHas('supervisors', builder => {
      builder.where('supervisor_id', supervisor_id)

    })
    .whereHas('roles', async (builder) => {
      builder.where('slug', 'marketing')
    })
    .where('name', 'like', `%${search}%`)
    // builder.orWhere('email', 'like', `%${search}%`)
    // builder.orWhere('phone', 'like', `%${search}%`)
    // builder.orWhere('address', 'like', `%${search}%`)

    .paginate(parseInt(page), parseInt(limit))
  return ResponseParser.apiCollection(data.toJSON())
}

async function searchBySupervisor(page, limit, supervisor_id) {
  const redisKey = `Marketing_Supervisor_${supervisor_id}`
  const cached = await RedisHelper.get(redisKey)
  if (cached) return cached
  const data = await User.query()
    .with('supervisors', builder => {
      builder.select('id', 'name')
    })
    .whereHas('supervisors', builder => {
      builder.where('supervisor_id', supervisor_id)
    })
    .whereHas('roles', async (builder) => {
      builder.where('role_id', await getMarketingRoleId())
    })
    .paginate(parseInt(page), parseInt(limit))
  const output = ResponseParser.apiCollection(data.toJSON())
  await RedisHelper.set(redisKey, output)
  return output
}

async function getMarketingRoleId() {
  let redisKey = 'MerktingId'
  let cached = await RedisHelper.get(redisKey)
  if(cached) {
    return cached
  }
  let marketingRole = await Role.findBy('slug', 'marketing')
  await RedisHelper.set(redisKey, marketingRole.id)
  return marketingRole.id
}
