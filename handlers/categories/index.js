const Categories = require('./Categories')
const Article = require('../articles/Article')

const getCategories = async () => {
  const categories = await Categories.find().lean()

  return categories
}

const getArticlesWithCategories = async (id) => {
  const article = await Article.findById(id).populate('category').lean()

  return article
}


// Alternative Approach for creating category
// const createCategory = async () => {
//   const categories = await 
// }

module.exports = {
  getCategories,
  getArticlesWithCategories
}