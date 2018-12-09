"use strict"

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model")

class DownPayment extends Model {
  target() {
    return this.belongsTo("App/Models/MarketingTarget")
  }
}

module.exports = DownPayment
