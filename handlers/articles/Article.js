const mongoose = require('mongoose')
const User = require('../user/User')
const { Schema, model: Model } = mongoose
const { String, ObjectId } = Schema.Types

const articleModel = new Schema({
  post: {
    type: String,
    required: true
  },
  meta: {
    type: String,
    required: true
  },
  author: {
    type: ObjectId,
    ref: 'User'
  }
})

articleModel.pre('save', function(next) {
  const author = this.author._id
  const article = this._id

  User.findOneAndUpdate({_id: author}, {$push: {articleHistory: article}})
    .then(() => {
      next()
    })

})

module.exports = new Model('Articles', articleModel)