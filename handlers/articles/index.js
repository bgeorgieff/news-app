const { validationResult } = require('express-validator')
const Article = require('./Article')
const { getCategories } = require('../categories')
const Categories = require('../categories/Categories')
const { getAllCategories, getCurrentCategory } = require('../../utils/helpers')

module.exports = {
  get: {
    async postArticle(req, res, next) {

      const categories = await getCategories()
      const postCategory = await getAllCategories()

      res.render('./posts/post-add', {
        isLoggedIn: req.user !== undefined,
        categories,
        postCategory,
        title: 'Create Article'
      })
    }, 
    viewArticle(req, res, next) {
      const { id } = req.params

      Article.findById(id).lean()
        .populate('author')
        .populate('tags')
        .populate({ path: 'comments', populate: { path: 'author' }})
        .populate({ path: 'comments', populate: [
          { path: 'reply' }, 
          { path: 'reply', populate: { path: 'author' }}]})
        .then((article) => {

        const views = article.views + 1
        const {isAdmin} = req.user || false


        Article.findByIdAndUpdate(id, { views: views }).then(() => {
          Article.find().sort({date:-1}).lean().then((articles) => {
            const trendingArticles = [...articles]
            const recentArticle = [...articles]

            trendingArticles.sort((a, b) => {return b.views - a.views}).splice(4)
            recentArticle.splice(1)

            res.render('./posts/postView', {
              isLoggedIn: req.user !== undefined,
              articleTitle: article.title,
              tags: article.tags,
              meta: article.meta,
              img: article.img,
              post: article.post,
              views: article.views,
              comments: article.comments,
              trendingArticles,
              recentArticle,
              author: article.replies.author,
              date: article.date,
              isAdmin,
              id: id,
              title: article.title
            })  
          }) 
        })
      })
    },
    async editArticleView(req, res, next) {
      const { id } = req.params

      const allCategories = await getCategories()

      Article.findById(id).lean().populate('tags').then((article) => {
        console.log(article);
        res.render('./posts/editArticle', {
          isLoggedIn: req.user !== undefined,
          title: article.title,
          meta: article.meta,
          img: article.img,
          post: article.post,
          author: article.author.username,
          id: id,
          categories: article.tags,
          allCategories
        })
      })
    }
  }, 
  post: {
    async postArticle(req, res, next) {
      const {
        title,
        post, 
        postMetaDescription,
        postCategory,
        indexFollow,
        postImg,
        noindexFollow,
        noindexNofollow,
        indexNofollow,
        addCategory,
        excerpt
      } = req.body

      let robots = ''
      const _id = req.user
      const date = new Date()
      const currentCategory = await getCurrentCategory(postCategory)

      if (noindexFollow) {
        robots += `<meta name="robots" content="follow, noindex">\n`
      }

      if (noindexNofollow) {
        robots += `<meta name="robots" content="nofollow, noindex">\n`
      }

      if (indexFollow) {
        robots += `<meta name="robots" content="index, follow">\n`
      }

      if (indexNofollow) {
        robots += `<meta name="robots" content="index, nofollow">\n`
      }

      const meta = `<meta name="description" content="${postMetaDescription}"/>`
      
      Article
      .create({ 
        date, title, postImg, post, meta, robots: robots.trim(), author: _id, textSnippet: excerpt, 
        views: 0, tags: addCategory, postCategory: currentCategory._id,})
      .then(() => { res.redirect('/home') 
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
        allCategories,
        textSnippet
      } = req.body

      const category = await getCategories()

      const filteredCategories = category.filter(e => {
        const categoryId = e._id.valueOf().toString()
        return !categoryId.includes(allCategories)
      })

      Article.updateOne({_id: id}, {$set: {title, post, meta: metaDescription, textSnippet, postImg, category: allCategories}})
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