'use strict'

const docs = require('../../../docs.json')

class DocumentController {
  async index({view}) {
    return view.render('docs2.index', {
      docs
    })
  }

  async intro({ view }) {
    return view.render('intro')
  }
}

module.exports = DocumentController
