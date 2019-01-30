"use strict"

module.exports = async (id, model) => {
  const dbModel = use("App/Models/" + model)
  const data = await dbModel.find(id)
  if (!data) {
    return false
  }
  return true
}
