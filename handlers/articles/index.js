const { validationResult } = require('express-validator')
const Article = require('./Article')
const {getCategories, getArticlesWithCategories } = require('../categories')
const Categories = require('../categories/Categories')

module.exports = {
  get: {
    async postArticle(req, res, next) {

      const categories = await getCategories()

      res.render('./posts/post-add', {
        isLoggedIn: req.user !== undefined,
        categories,
      })
    }, 
    viewArticle(req, res, next) {
      const { id } = req.params

      Article.findById(id).populate('author').lean().then((article) => {
        const views = article.views + 1

        Article.findByIdAndUpdate(id, {
          views: views
        })
        .then(() => {
          res.render('./posts/postView', {
            isLoggedIn: req.user !== undefined,
            title: article.title,
            meta: article.meta,
            img: article.img,
            post: article.post,
            author: article.author.username,
            id: id
          })  
        })
      })
    },
    async editArticleView(req, res, next) {
      const { id } = req.params

      const allCategories = await getCategories()

      Article.findById(id).lean().populate('category').then((article) => {
        res.render('./posts/editArticle', {
          isLoggedIn: req.user !== undefined,
          title: article.title,
          meta: article.meta,
          img: article.img,
          post: article.post,
          author: article.author.username,
          id: id,
          categories: article.category,
          allCategories
        })
      })
    }
  }, 
  post: {
    postArticle(req, res, next) {
      const {
        title,
        post, 
        metaDescription,
        indexFollow,
        postImg,
        noindexFollow,
        noindexNofollow,
        addCategory
      } = req.body

      const _id = req.user
      const date = new Date()
      
      const robots = noindexFollow + indexFollow + noindexNofollow
      
      const meta = `<meta name="description" content="${metaDescription}"/>`
      
      Article.create({ 
        date, 
        title, 
        postImg, 
        post, 
        meta, 
        robots, 
        author: _id, 
        views: 0,
        category: addCategory
      }).then(() => {
          res.redirect('/home')
        }).catch((err) => {
          console.log(err);
        })
    },
    addCategory(req, res, next) {
      const { newCategory } = req.body

      Categories.create({ name: newCategory }).then(() => res.redirect('/article/create'))
    }
  },
  put: {
    async editArticle(req, res, next) {
      const { id } = req.params
      const {
        title,
        post, 
        metaDescription,
        indexFollow,
        postImg,
        noindexFollow,
        noindexNofollow,
        allCategories
      } = req.body
      console.log(allCategories);
      const category = await getCategories()

      const filteredCategories = category.filter(e => {
        const categoryId = e._id.valueOf().toString()
        return !categoryId.includes(allCategories)
      })

      Article.updateMany({_id: id}, {$set: {title, post, meta: metaDescription, postImg, category: allCategories}})
        .then(() => {
        Promise.all([
          Categories.updateMany({_id: allCategories}, {$addToSet: {article: id}}),
          Categories.updateMany({_id: filteredCategories}, {$pullAll: {article: [id]}})
        ]).then(() => {
          res.redirect('/home')
        })
        .catch((err) => {
          console.log(err)
        })
      })
    }
  },
  delete: {
    deleteArticle(req, res, next) {
      const { id } = req.params

      Article.deleteOne({ _id: id}).then(() => {
        res.redirect('/home')
      })
    }
  }
}