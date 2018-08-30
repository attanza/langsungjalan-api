'use strict'

const SchedulleSerializer = require('./SchedulleSerializer')

module.exports = data => {
  let output = []
  data.map(s => {
    output.push(s)
  })
  return output
}
