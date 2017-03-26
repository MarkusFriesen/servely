var sanitizer = require('sanitize-html'),
    _ = require('lodash')

module.exports = function() {
  return function(req, res, next) {
    if (req.body) {
      _.forEach(req.body, (value, key) => {
        if (!parseInt(value,10) && value !== null && key != 'description') {
          if (typeof value === 'string') {
            value = value.replace(/&gt;/gi, '>')
            value = value.replace(/&lt;/gi, '<')
            value = value.replace(/(&copy;|&quot;|&amp;)/gi, '')
          }
          req.body[key] = sanitizer(value, {
            allowedTags: []
          })
        }
      })
    }
    return next()
  }
}
