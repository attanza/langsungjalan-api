'use strict'

const Factory = use('Factory')
const Product = use('App/Models/Product')

class ProductSeeder {
  async run () {
    await Product.truncate()
    await Factory
      .model('App/Models/Product')
      .createMany(3)
  }
}

module.exports = ProductSeeder
