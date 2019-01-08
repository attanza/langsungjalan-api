'use strict'

const Model = use('Model')

class Permission extends Model {

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
    return [
      '@provider:Adonis/Acl/HasRole'
    ]
  }
}

module.exports = Permission
