'use strict'

var _ = require('underscore')

module.exports = function(options) {
  if (!options) {
    options = {}
  }

  _.defaults(options, { showStack: false, dumpExceptions: false })

  return function(err, req, res) {
    if (options.dumpExceptions) {
      console.error(err.stack || err)
    }
    if (!options.showStack) {
      delete err.stack
    }

    return res.render('404')
  }
}
