const PostCategory = require('../postCategory/postCategory')
const {getAllCategories} = require('../../utils/helpers')
const Articles = require('../articles/Article')

module.exports = {
  post: {
    createCategory(req, res, next) {
      const {message} = req.body
      
      PostCategory.create({postCategory: message}).then(() => {
        res.redirect('/home')
      })
    }
  },
  get: {
    async getCategory(req, res, next) {
      const {id} = req.params
      const categories = await getAllCategories()
      const {isAdmin} = req.user || false
      
      PostCategory.findById({_id: id}).populate({path: 'articles'}).lean().then((category) => {
        const articleIds = category.articles.map((e) => {return e._id})
        
        Articles.find({_id: articleIds}).populate('postCategory').lean().then((article) => {

          Articles.find().sort({date:-1}).lean().then((articles) => {
            const trendingArticles = [...articles]
            const recentArticle = [...articles]
            
            trendingArticles.sort((a, b) => {return b.views - a.views}).splice(4)
            recentArticle.splice(1)

            res.render('./posts/category.hbs', {
              isLoggedIn: req.user !== undefined,
              isAdmin,
              article,
              categoryTitle: category.postCategory,
              categories,
              trendingArticles,
              recentArticle
            })
          })
        })
      })
    }
  }
}