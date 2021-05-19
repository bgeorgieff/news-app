const Articles = require('../articles/Article')

module.exports = {
  get: {
    home(req, res, next) {
      
      Articles.find().lean().then((article) => {

        res.render('home.hbs', {
          isLoggedIn: req.user !== undefined,
          article
        })
      })
    }
  },
  post: {

  }
}