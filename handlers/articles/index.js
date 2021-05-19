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

      Article.findById(id).then((article) => {
        console.log(article);
        console.log(req.user);
        res.render('./posts/postView', {
          isLoggedIn: req.user !== undefined,
          title: article.title,
          meta: article.meta,
          img: article.img,
          post: article.post
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
        noindexFollow,
        noindexNofollow
      } = req.body

      const _id = req.user
      const date = new Date()

      const robots = noindexFollow + indexFollow + noindexNofollow
      
      const meta = `<meta name="description" content="${metaDescription}"/>`

      Article.create({date, title, post, meta, robots, author: _id})
        .then(() => {
          res.redirect('/home')
        }).catch((err) => {
          console.log(err);
        })
    }
  }
}