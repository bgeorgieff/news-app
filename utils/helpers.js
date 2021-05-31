const adminSecret = require('../config/config').adminSecret
const PostCategory = require('../handlers/postCategory/postCategory')

const adminValidation = (data) => {
  if (data === adminSecret) {
    return !!data
  } else {
    return false
  }
}

const getAllCategories = () => {
  const categories = PostCategory.find().lean()
  return categories
}

const getCurrentCategory = (name) => {
  const current = PostCategory.findOne( {postCategory: name} ).lean()
  return current
}

module.exports = {
  adminValidation,
  getAllCategories,
  getCurrentCategory
}