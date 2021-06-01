const PostCategory = require('../postCategory/postCategory')

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
    getCategory(req, res, next) {
 
    }
  }
}