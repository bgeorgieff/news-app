const mongoose = require('mongoose')
const { model: Model, Schema } = mongoose
const { String, ObjectId } = Schema.Types 

const postCategorySchema = new Schema({
  postCategory: {
    type: String
  },
  articles: [{
    type: ObjectId,
    ref: 'Articles'
  }]
})

module.exports = new Model('PostCategory', postCategorySchema)