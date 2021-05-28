const adminSecret = require('../config/config').adminSecret
const postCategory = require('../handlers/postCategory/postCategory')

const adminValidation = (data) => {
  if (data === adminSecret) {
    return !!data
  } else {
    return false
  }
}

const getCategories = () => {
  const categories = postCategory.find().lean()
  return categories
}

module.exports = {
  adminValidation,
  getCategories
}