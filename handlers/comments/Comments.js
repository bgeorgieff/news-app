const mongoose = require('mongoose')
const { model: Model, Schema } = mongoose
const { String, ObjectId } = Schema.Types 
const Article = require('../articles/Article')

const commentSchema = new Schema({
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
    ref: 'Replies'
  }]
})

commentSchema.pre('save', function(next) {
  const article = this.article
  const comment = this._id

  Article.findOneAndUpdate({_id: article}, {$addToSet: {comments: comment}})
    .then(() => {
      next()
    })
})

// Apply user schema hereeeeee
// commentSchema.pre('save', function(next) {
//   const article = this.article
//   const comment = this._id

//   Article.findOneAndUpdate({_id: article}, {$addToSet: {comments: comment}})
//     .then(() => {
//       next()
//     })
// })

module.exports = new Model('Comments', commentSchema)