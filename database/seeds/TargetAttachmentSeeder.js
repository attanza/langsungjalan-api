'use strict'

const TargetAttachment = use('App/Models/TargetAttachment')

class TargetAttachmentSeeder {
  async run () {
    await TargetAttachment.truncate()
  }
}

module.exports = TargetAttachmentSeeder
