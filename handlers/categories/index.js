const Categories = require('./Categories')
const Article = require('../articles/Article')

const getCategories = async () => {
  const categories = await Categories.find().lean()

  return categories
}

module.exports = {
  getCategories,

  get: {
    getPerTag(req, res, next) {
      const { id } = req.params
      const {isAdmin} = req.user || false
      
      Categories.findById({_id: id}).populate({path: 'article', populate: [
        {path: 'postCategory'}
      ]}).lean().then((tag) => {
        const articles = tag.article

        Article.find().populate('postCategory').sort({date: -1}).lean().then((articles) => {
          const trendingArticles = [...articles]
          const recentArticle = [...articles]
  
          trendingArticles.sort((a, b) => {return b.views - a.views}).splice(4)
          recentArticle.splice(1)

          res.render('./posts/tags.hbs', {
            isLoggedIn: req.user !== undefined,
            articles,
            name: tag.name,
            isAdmin,
            trendingArticles,
            recentArticle
          })
        })
      })
    }
  }
}