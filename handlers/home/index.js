const Articles = require('../articles/Article')

module.exports = {
  get: {
    home(req, res, next) {

      Articles.find().sort({date:-1}).lean().then((article) => {
        const trendingArticles = [...article]
        
        trendingArticles.sort((a, b) => b.views - a.views)
          .splice(3)
          
        res.render('home', {
          isLoggedIn: req.user !== undefined,
          article,
          trendingArticles
        })
      })
    }
  },
  post: {

  }
}