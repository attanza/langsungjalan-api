"use strict"

/** @type {import('@adonisjs/lucid/src/Factory')} */
const DP = use("App/Models/DownPayment")
class DownPaymentSeeder {
  async run() {
    await DP.truncate()
  }
}

module.exports = DownPaymentSeeder
