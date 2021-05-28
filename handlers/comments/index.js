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
        Replies.create({comment: message, author: _id, commentId: id, article: articleId})
          .then(() => {
            res.redirect(`/article/post/${comment.article}`)
          })
      })

    },
    reToRe(req, res, next) {
      const {message} = req.body
      const {id} = req.params
      const {_id} = req.user._id


      Replies.findById({_id: id}).lean().then((reply) => {
        const articleId = reply.article
        const comID = reply.commentId
 
        Replies.create({comment: message, author: _id, reply: id, article: articleId, commentId: comID})
        .then((e) => {
          Comments.findOneAndUpdate({_id: e.commentsId}, {$addToSet: {reply: e._id}})
          .then(() => {
            res.redirect(`/article/post/${reply.article}`)
          })
          .catch((err) => {
            console.error(err);
          })
        })
      })
    }
  },
}