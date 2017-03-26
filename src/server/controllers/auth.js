let passport = require('passport'),
    Models = require('../models'),
    config = require('../config/auth'),
    passport_strategies = {
      github: require('passport-github2').Strategy,
      facebook: require('passport-facebook').Strategy,
      twitter: require('passport-twitter').Strategy,
      google: require('passport-google-oauth').OAuth2Strategy
    }

let handler = (accessToken, refreshToken, profile, done) => {
  let unique_val, email = '', avatar = ''

  switch(profile.provider) {
    case 'facebook':
      unique_val = profile.id.toString()
      email = profile.emails[0].value
      avatar = profile.photos ? profile.photos[0].value : ''
      break
    case 'twitter':
      unique_val = profile.id.toString()
      avatar = profile.photos ? profile.photos[0].value : ''
      break
    case 'google':
      unique_val = profile.id.toString()
      email = profile.emails[0].value
      avatar = profile.photos ? profile.photos[0].value : ''
      break
    case 'github':
      unique_val = profile.id.toString()
      email = profile.emails[0].value
      avatar = profile._json.avatar_url
      break
  }

  let searchQuery = { 'social.unique_val': unique_val, 'provider': profile.provider },
      updates = {
        name: profile.displayName,
        email: email,
        display: '',
        avatar: avatar,
        social: {
          network_id: profile.id,
          provider: profile.provider,
          unique_val: unique_val,
          access_token: accessToken
        }
      },
      options = { new: true, upsert: true }

  Models.User.findOneAndUpdate(searchQuery, updates, options, (err, user) => {
    if (err) {
      return done(err)
    } else {
      return done(null, user)
    }
  })
}

function init() {
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })
  passport.deserializeUser(function(id, done) {
    Models.User.findById(id, function (err, user) {
      done(err, user)
    })
  })
}

module.exports = function(strategy) {
  passport.use(new passport_strategies[strategy](config[strategy], handler))
  init()
  return passport
}
