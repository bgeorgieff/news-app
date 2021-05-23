const mongoose = require('mongoose')
const { model: Model, Schema } = mongoose
const { String, ObjectId } = Schema.Types 

const categoryTypes = new Schema({
    name: {
      type: String,
      unique: true
    },
    article: [{
      type: ObjectId,
      ref: 'Article'
    }]
})

module.exports = new Model('Categories', categoryTypes)