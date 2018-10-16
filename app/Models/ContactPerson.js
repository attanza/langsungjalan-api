'use strict'

const Model = use('Model')

class ContactPerson extends Model {
  target() {
    return this.belongsTo('App/Models/MarketingTarget')
  }
}

module.exports = ContactPerson
