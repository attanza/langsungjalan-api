'use strict'

const StudyProgramCombo = require('./StudyProgramCombo')

module.exports = (studies) => {
  let output = []
  if(studies) {
    studies.map(study => {
      output.push(StudyProgramCombo(study))
    })
    return output
  }
}
