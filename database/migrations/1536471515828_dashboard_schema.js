'use strict'

const Schema = use('Schema')

class DashboardSchema extends Schema {
  up () {
    this.create('dashboards', (table) => {
      table.increments()
      table.integer('total_marketings').default(0)
      table.integer('total_universities').default(0)
      table.integer('total_products').default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('dashboards')
  }
}

module.exports = DashboardSchema
