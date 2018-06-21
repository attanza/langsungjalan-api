'use strict'

const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.string('code', 25).unique().index()
      table.string('name', 50).notNullable()
      table.string('measurement', 25).notNullable()
      table.integer('price').notNullable()
      table.string('description', 250).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductSchema

/*
code
name
measurement
price
description
*/
