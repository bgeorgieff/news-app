const adminSecret = require('../config/config').adminSecret
const PostCategory = require('../handlers/postCategory/postCategory')

// ADMIN VALIDATION
const adminValidation = (data) => {
  if (data === adminSecret) {
    return !!data
  } else {
    return false
  }
}

// CATEGORY GETTER
const getAllCategories = () => {
  const categories = PostCategory.find().lean()
  return categories
}

// CURRENT CATEGORY GETER
const getCurrentCategory = (name) => {
  const current = PostCategory.findOne( {postCategory: name} ).lean()
  return current
}

// ROBOTS STRING 
const getRobotsString = (noindexFollow, noindexNofollow, indexFollow, indexNofollow) => {
  let robots = ''

  if (noindexFollow) {
    robots += `<meta name="robots" content="follow, noindex">\n`
  }

  if (noindexNofollow) {
    robots += `<meta name="robots" content="nofollow, noindex">\n`
  }

  if (indexFollow) {
    robots += `<meta name="robots" content="index, follow">\n`
  }

  if (indexNofollow) {
    robots += `<meta name="robots" content="index, nofollow">\n`
  }

  return robots.trim()
}

module.exports = {
  adminValidation,
  getAllCategories,
  getCurrentCategory,
  getRobotsString
}