const User = require('../user/User')
const { validationResult } = require('express-validator')
const Article = require('./Article')
const { secret } = require('../../config/config')
const jwt = require('jsonwebtoken')

module.exports = {
  get: {
    postArticle(req, res, next) {
      res.render('./posts/post-add', {
        isLoggedIn: req.user !== undefined
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
    editArticleView(req, res, next) {
      const { id } = req.params
      const {
        title,
        meta,
        img,
        post,
        author
      } = req.body

      console.log(req.body);

      Article.findById(id).lean().then((article) => {
        res.render('./posts/editArticle', {
          isLoggedIn: req.user !== undefined,
          title: article.title,
          meta: article.meta,
          img: article.img,
          post: article.post,
          author: article.author.username,
          id: id
          
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
        noindexNofollow
      } = req.body

      const _id = req.user
      const date = new Date()

      const robots = noindexFollow + indexFollow + noindexNofollow
      
      const meta = `<meta name="description" content="${metaDescription}"/>`

      Article.create({date, title, postImg, post, meta, robots, author: _id, views: 0})
        .then(() => {
          res.redirect('/home')
        }).catch((err) => {
          console.log(err);
        })
    },
  },
  put: {
    editArticle(req, res, next) {
      const { id } = req.params
      const {
        title,
        post, 
        metaDescription,
        indexFollow,
        postImg,
        noindexFollow,
        noindexNofollow
      } = req.body
      console.log(req.body);

      Article.findByIdAndUpdate(id, {
        title,
        post, 
        meta: metaDescription,
        postImg,
      }).then(() => {
        res.redirect('/home')
      })
    }
  },
  delete: {
    deleteArticle(req, res, next) {
      const {id} = req.params

      Article.deleteOne({ _id: id}).then((e) => {
        res.redirect('/home')
      })
    }
  }
}