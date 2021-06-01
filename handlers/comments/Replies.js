const mongoose = require('mongoose')
const Articles = require('../articles/Article')
const { model: Model, Schema } = mongoose
const { String, ObjectId } = Schema.Types 
const Comments = require('./Comments')

const replySchema = new Schema({
  comment: {
    type: String
  }, 
  author: {
    type: ObjectId,
    ref: 'User'
  },
  article: {
    type: ObjectId,
    ref: 'Article'
  },
  reply: [{
    type: ObjectId,
    ref: 'Comments'
  }],
  commentId: {
    type: ObjectId,
    ref: 'Comments'
  }
})

replySchema.pre('save', function(next) {
  const commentId = this.commentId
  const replyId = this._id
  const articleId = this.article

  Promise.all([
    Articles.findOneAndUpdate({_id: articleId}, {$addToSet: {replies: replyId}}),
    Comments.findOneAndUpdate({_id: commentId}, {$addToSet: {reply: replyId}})
  ]).then(() => {
      next()
  }).catch((err) => console.error(err))

})

module.exports = new Model('Replies', replySchema)