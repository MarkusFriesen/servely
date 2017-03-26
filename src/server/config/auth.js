module.exports = {
  github: {
    clientID: 'CLIENT_ID_HERE',
    clientSecret: 'mysecret',
    callbackURL: 'http://localhost:3500/auth/github/callback',
    profileFields:  ['id', 'username', 'email']
  },
  facebook: {
    clientID: 'CLIENT_ID_HERE',
    clientSecret: 'CLIENT_SECRET_HERE',
    callbackURL: 'http://localhost:3500/auth/facebook/callback',
    profileFields:  ['id', 'displayName', 'email', 'photos']
  },
  twitter: {
    consumerKey: 'CONSUMER_KEY_HERE',
    consumerSecret: 'CONSUMER_SECRET_HERE',
    callbackURL: 'http://localhost:3500/auth/twitter/callback',
    profileFields:  ['id', 'displayName', 'email', 'username']
  },
  google: {
    clientID: 'CLIENT_ID_HERE',
    clientSecret: 'CLIENT_SECRET_HERE',
    callbackURL: 'http://localhost:3500/auth/google/callback',
    profileFields:  ['id', 'displayName', 'email']
  }
}
