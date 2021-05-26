const Articles = require('../articles/Article')

module.exports = {
  get: {
    async home(req, res, next) {


      // Articles.paginate({}, {select: 'title', offset: 3, limit: 2 }).then((result) => {
      //   console.log(result);
      // })

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