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
    }
  },
  post: {
    postArticle(req, res, next) {
      const {
        post, 
        metaDescription,
        indexFollow,
        noindexFollow,
        noindexNofollow
      } = req.body

      const _id = req.user

      const robots = noindexFollow + indexFollow + noindexNofollow
      
      const meta = `<meta name="description" content="${metaDescription}"/>`

      Article.create({post, meta, robots, author: _id})
        .then(() => {
          res.redirect('/home')
        }).catch((err) => {
          console.log(err);
        })
    }
  }
}