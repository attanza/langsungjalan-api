'use strict'

class DocumentController {
  async index({view}) {
    return view.render('docs.index')
  }
}

module.exports = DocumentController
