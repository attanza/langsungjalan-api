'use strict'

const Model = use('Model')
const Env = use('Env')

class TargetAttachment extends Model {
  target() {
    return this.belongsTo('App/Models/MarketingTarget')
  }

  getUrl() {
    if (this.url) {
      return `${getBaseUrl()}${this.url}`
    } else return ''
  }
}

module.exports = TargetAttachment

function getBaseUrl() {
  let environment = Env.get('NODE_ENV')
  if(environment === 'production') {
    return Env.get('PRODUCTION_APP_URL')
  } else {
    return Env.get('APP_URL')
  }
}
