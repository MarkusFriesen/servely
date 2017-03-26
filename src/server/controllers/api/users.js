let Models = require('../../models')

module.exports = {
  getUserById(req, res) {
    Models.User.findOne({_id: req.session.user_id}, (err, user) => {
      delete user.social
      res.json(user)
    })
  }
}
