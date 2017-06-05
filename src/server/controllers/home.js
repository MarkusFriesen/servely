module.exports = {
  index(req, res) {
    let loggedin = req.session.user_id || false
    let model = {
      layout: false,
      session_id: req.session.id,
      loggedin: loggedin,
      userid: req.session.user_id
    }

    res.render('../public/index.html', model)
  }
}
