const mongoose = require('mongoose')
const { ObjectID } = require('bson')
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

module.exports = new Model('Articles', articleModel)