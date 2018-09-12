'use strict'

const Model = use('Model')
const Env = use('Env')

class MarketingReportAttachment extends Model {
  report() {
    return this.belongsTo('App/Models/MarketingReport')
  }

  getUrl() {
    if (this.url) {
      return `${getBaseUrl()}${this.url}`
    } else return ''
  }
}

module.exports = MarketingReportAttachment

function getBaseUrl() {
  let environment = Env.get('NODE_ENV')
  if(environment === 'production') {
    return Env.get('PRODUCTION_APP_URL')
  } else {
    return Env.get('APP_URL')
  }
}
