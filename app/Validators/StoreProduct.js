'use strict'
const { ResponseParser } = use('App/Helpers')

class StoreProduct {

  get rules() {
    const id = this.ctx.params.id
    return {
      code: `required|max:25|unique:pruducts,code,id,${id}`,
      name: `required|max:50|unique:pruducts,name,id,${id}`,
      measurement: 'required|max:25',
      price: 'required|integer',
      description: 'max:250'
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      integer: '{{ field }} need to be an integer value',
      max: '{{ field }} cannot more than {{ arguments:0 }} characters',

    }
  }

  get sanitizationRules () {
    return {
      code: 'escape',
      name: 'escape',
      measurement: 'escape',
      price: 'toInt',
      description: 'escape'
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreProduct
