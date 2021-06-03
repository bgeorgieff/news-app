const Categories = require('./Categories')
const Article = require('../articles/Article')

const getCategories = async () => {
  const categories = await Categories.find().lean()

  return categories
}

module.exports = {
  getCategories,
}