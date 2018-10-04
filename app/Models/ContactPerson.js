'use strict';

const Model = use('Model')

class ContactPerson extends Model {
  report() {
    return this.belongsTo('App/Models/MarketingReport')
  }
}

module.exports = ContactPerson
