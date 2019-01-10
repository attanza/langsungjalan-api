"use strict"

const Model = use("Model")

class MarketingTarget extends Model {
  study() {
    return this.belongsTo("App/Models/StudyProgram")
  }
  contacts() {
    return this.hasMany("App/Models/MarketingTargetContact")
  }

  schedulles() {
    return this.hasMany("App/Models/Schedulle")
  }

  downpayments() {
    return this.hasMany("App/Models/DownPayment")
  }
}

module.exports = MarketingTarget
