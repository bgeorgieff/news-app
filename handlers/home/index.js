const Articles = require('../articles/Article')

module.exports = {
  get: {
    home(req, res, next) {

      Articles.find().lean().then((article) => {
        const post = article
        console.log(post.toString());
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