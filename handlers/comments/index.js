const Article = require('../articles/Article')
const User = require('../user/User')
const Comments = require('./Comments')
const Replies = require('./Replies')

module.exports = {
  post: {
    createPost(req, res, next) {
      const {message} = req.body
      const {id} = req.params
      const {_id} = req.user._id

      Promise.all([
        Comments.create({comment: message, author: _id, article: id}),
      ]).then(() => {
        res.redirect(`/article/post/${id}`)
      }).catch(err => { console.error(err)})  
    },
    reply(req, res, next) {
      const {message} = req.body
      const {id} = req.params
      const {_id} = req.user._id

      Comments.findById({_id: id}).lean().then((comment) => {
        const articleId = comment.article

        Replies.create({comment: message, author: _id, reply: id, article: articleId})
          .then(() => {
            res.redirect(`/article/post/${comment.article}`)
          })
      })
      
      // console.log(_id);
    }
  },
}