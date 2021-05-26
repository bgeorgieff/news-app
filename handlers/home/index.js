const Articles = require('../articles/Article')

module.exports = {
  get: {
    home(req, res, next) {

      // PAGGINATION!!!!!!!!
      // Articles.paginate({}, {select: 'title', offset: 3, limit: 2 }).then((result) => {
      //   console.log(result);
      // })


      const {isAdmin} = req.user || false

      Articles.find().sort({date:-1}).populate('category')
        .lean().then((article) => {
        const trendingArticles = [...article]

        trendingArticles.sort((a, b) => b.views - a.views)
          .splice(3)
          
        res.render('home', {
          isLoggedIn: req.user !== undefined,
          article,
          category: article.category,
          isAdmin,
          trendingArticles
        })
      })
    }
  },
  post: {

  }
}