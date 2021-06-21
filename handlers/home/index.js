const Articles = require('../articles/Article')
const { getAllCategories } = require('../../utils/helpers')

module.exports = {
  get: {
    async home(req, res, next) {

      const {isAdmin} = req.user || false

      const categories = await getAllCategories()

      Articles.find().sort({date:-1})
        .populate('category')
        .populate('postCategory').lean().then((article) => {
        
        const trendingArticles = [...article]
        const articles = [...article]

        trendingArticles.sort((a, b) => b.views - a.views).splice(6)

        const latestArticle = articles.shift()
        articles.splice(5)
        // console.log(latestArticle);

        res.render('home', {
          isLoggedIn: req.user !== undefined,
          latestArticle,
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