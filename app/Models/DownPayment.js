"use strict"

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model")

class DownPayment extends Model {
  target() {
    return this.belongsTo("App/Models/MarketingTarget")
  }

  verifier() {
    return this.belongsTo("App/Models/User", "verified_by")
  }
}

module.exports = DownPayment
