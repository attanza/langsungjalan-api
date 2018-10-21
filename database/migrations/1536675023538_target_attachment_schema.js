'use strict'

const Schema = use('Schema')

class TargetAttachmentSchema extends Schema {
  up () {
    this.create('target_attachments', (table) => {
      table.increments()
      table.integer('marketing_target_id').unsigned().index()
      table.string('url')
      table.string('caption')
      table.string('tags')
      table.timestamps()
    })
  }

  down () {
    this.drop('target_attachments')
  }
}

module.exports = TargetAttachmentSchema
