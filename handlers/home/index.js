const Articles = require('../articles/Article')

module.exports = {
  get: {
    home(req, res, next) {

      Articles.find().sort({date:-1}).lean().then((article) => {
        res.render('home', {
          isLoggedIn: req.user !== undefined,
          article
        })
      })
    }
  },
  post: {

  }
}