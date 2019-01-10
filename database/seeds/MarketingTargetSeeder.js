"use strict"

const MarketingTarget = use("App/Models/MarketingTarget")

const Factory = use("Factory")

class MarketingTargetSeeder {
  async run() {
    await MarketingTarget.truncate()
    await Factory.model("App/Models/MarketingTarget").createMany(3)
  }
}

module.exports = MarketingTargetSeeder
