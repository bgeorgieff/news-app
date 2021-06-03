const Categories = require('./Categories')

const getCategories = async () => {
  const categories = await Categories.find().lean()

  return categories
}

module.exports = {
  getCategories,
}