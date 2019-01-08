"use strict"

const Model = use("Model")

class Role extends Model {
  static boot() {
    super.boot()

    this.addTrait("@provider:Lucid/Slugify", {
      fields: {
        slug: "name",
      },
      strategy: "dbIncrement",
      disableUpdates: true,
    })
  }

  static get traits() {
    return ["@provider:Adonis/Acl/HasPermission"]
  }

  static get hidden() {
    return ["created_at", "updated_at"]
  }

  // permissions() {
  //   return this.belongsToMany('App/Models/Permission')
  // }
}

module.exports = Role
