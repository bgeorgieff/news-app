const Articles = require('../articles/Article')
const { getAllCategories } = require('../../utils/helpers')

module.exports = {
  get: {
    async home(req, res, next) {

      // PAGGINATION!!!!!!!!
      // Articles.paginate({}, {select: 'title', offset: 3, limit: 2 }).then((result) => {
      //   console.log(result);
      // })


      const {isAdmin} = req.user || false

      const categories = await getAllCategories()

      Articles.find().sort({date:-1}).populate('category').lean().then((article) => {
        
        const trendingArticles = [...article]
        const articles = [...article]

        trendingArticles.sort((a, b) => b.views - a.views)
          .splice(6)

        articles.splice(4)

        res.render('home', {
          isLoggedIn: req.user !== undefined,
          articles,
          categories,
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