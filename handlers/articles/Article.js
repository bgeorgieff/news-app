const mongoose = require('mongoose')
const User = require('../user/User')
const { Schema, model: Model } = mongoose
const { String, ObjectId } = Schema.Types
const mongoosePaginate = require('mongoose-paginate-v2')
const Categories = require('../categories/Categories')

const articleModel = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  },
  textSnippet: {
    type: String,
    required: true
  },
  postImg: {
    type: String,
    required: true
  },
  robots: {
    type: String
  },
  meta: {
    type: String,
    required: true
  },
  postCategory: {
    type: String,
    // required: true
  },
  author: {
    type: ObjectId,
    ref: 'User'
  },
  views: {
    type: Number
  },
  comments: [{
    type: ObjectId,
    ref: 'Comments'
  }],
  replies: [{
    type: ObjectId,
    ref: 'Replies'
  }],
  category: [{
    type: ObjectId,
    ref: 'Categories'
  }]
})

articleModel.pre('save', function(next) {
  const author = this.author._id
  const article = this._id

  User.findOneAndUpdate({_id: author}, {$addToSet: {articleHistory: article}})
    .then(() => {
      next()
    }).catch((err) => console.log(err))
})

articleModel.pre('save', function(next) {
  const article = this._id
  const categoryAddArray = this.category

  Categories.updateMany({_id: categoryAddArray}, {$addToSet: {article: article}}).then(() => {
    next()
  }).catch((err) => console.log(err))

})

articleModel.plugin(mongoosePaginate)

module.exports = new Model('Articles', articleModel)