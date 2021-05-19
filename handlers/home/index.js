const Articles = require('../articles')

module.exports = {
  get: {
    home(req, res, next) {
      res.render('home.hbs', {
        isLoggedIn: req.user !== undefined
      })
    }
  },
  post: {

  }
}