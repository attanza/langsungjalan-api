"use strict"

const User = use("App/Models/User")
const Role = use("App/Models/Role")
const { RedisHelper, ResponseParser } = use("App/Helpers")
const { ActivityTraits, ActivationTraits } = use("App/Traits")
const Hash = use("Hash")
const fillable = [
  "name",
  "email",
  "password",
  "phone",
  "address",
  "description",
  "is_active",
]

class UserController {
  /**
   * Index
   * Get List of Users
   */
  async index({ request, response }) {
    let {
      page,
      limit,
      search,
      search_by,
      search_query,
      between_date,
      start_date,
      end_date,
      sort_by,
      sort_mode,
    } = request.get()

    if (!page) page = 1
    if (!limit) limit = 10
    if (!sort_by) sort_by = "name"
    if (!sort_mode) sort_mode = "asc"

    const redisKey = `User_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}`

    let cached = await RedisHelper.get(redisKey)

    if (cached && !search) {
      return cached
    }

    const data = await User.query()
      .with("roles")
      .where(function () {
        if (search && search != "") {
          this.where("name", "like", `%${search}%`)
          this.orWhere("email", "like", `%${search}%`)
          this.orWhere("phone", "like", `%${search}%`)
          this.orWhere("address", "like", `%${search}%`)
        }

        if (search_by && search_query) {
          this.where(search_by, "like", `%${search_query}%`)
        }

        if (between_date && start_date && end_date) {
          this.whereBetween(between_date, [start_date, end_date])
        }
      })
      .orderBy(sort_by, sort_mode)
      .paginate(page, limit)

    let parsed = ResponseParser.apiCollection(data.toJSON())
    if (!search || search == "") {
      await RedisHelper.set(redisKey, parsed)
    }
    return response.status(200).send(parsed)
  }

  /**
   * Store
   * Create New User
   */

  async store({ request, response, auth }) {
    let body = request.only(fillable)
    const data = await User.create(body)
    let { roles } = request.post()
    if (roles) {
      await this.attachRoles(data, roles)
    }
    await data.load("roles")
    await ActivationTraits.createAndActivate(data)
    await RedisHelper.delete("User_*")
    await RedisHelper.delete("Marketing_*")
    await RedisHelper.delete("Supervisors_*")
    const activity = `Add new User '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    let parsed = ResponseParser.apiCreated(data.toJSON())
    return response.status(201).send(parsed)
  }

  /**
   * Show
   * Get User by ID
   */

  async show({ request, response }) {
    const id = request.params.id
    let redisKey = `User_${id}`
    let cached = await RedisHelper.get(redisKey)
    if (cached) {
      return response.status(200).send(cached)
    }

    const data = await User.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    await data.loadMany(["roles", "marketings", "supervisors"])
    let parsed = ResponseParser.apiItem(data.toJSON())
    await RedisHelper.set(redisKey, parsed)
    return response.status(200).send(parsed)
  }

  /**
   * Update
   * Update User data by ID
   */

  async update({ request, response, auth }) {
    const id = request.params.id
    const data = await User.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }
    let body = request.only(fillable)
    if (body.password) {
      const hashPassword = await Hash.make(body.password)
      body.password = hashPassword
    }
    await data.merge(body)
    await data.save()
    let { roles } = request.post()
    if (roles) {
      await this.attachRoles(data, roles)
    }
    await data.load("roles")
    const activity = `Update User '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete("User_*")
    await RedisHelper.delete("Marketing_*")
    await RedisHelper.delete("Supervisors_*")
    let parsed = ResponseParser.apiUpdated(data.toJSON())
    return response.status(200).send(parsed)
  }

  /**
   * Delete
   * Delete User data by ID
   */

  async destroy({ request, response, auth }) {
    const id = request.params.id
    const data = await User.find(id)
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound())
    }

    const activity = `Delete User '${data.name}'`
    await ActivityTraits.saveActivity(request, auth, activity)
    await RedisHelper.delete("User_*")
    await RedisHelper.delete("Marketing_*")
    await RedisHelper.delete("Supervisors_*")
    // Delete Relationship
    await data.tokens().delete()
    await data.supervisors().detach()
    await data.marketings().detach()
    await data.roles().detach()
    // Delete Data
    await data.delete()
    return response.status(200).send(ResponseParser.apiDeleted())
  }

  /**
   * Attach Users to User
   */

  async attachRoles(user, roles) {
    for (let i = 0; i < roles.length; i++) {
      let data = await Role.find(roles[i])
      if (data) {
        await user.roles().sync(data.id)
      }
    }
  }
}

module.exports = UserController
