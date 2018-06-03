'use strict'

const University = use('App/Models/University')

class ComboDataController {
  async index({request, response}) {
    const {model} = request.get()
    switch (model) {
    case 'University': {
      const universities = await this.getUniversities()
      return response.status(200).send(universities)
    }


    default:
      return response.status(400).send({'message': 'Model not found'})
    }
  }

  async getUniversities() {
    return await  University.query().select('id', 'name').orderBy('name').fetch()
  }
}

module.exports = ComboDataController
