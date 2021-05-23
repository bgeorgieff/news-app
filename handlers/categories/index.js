const Categories = require('./Categories')

const getCategories = () => {
  const categories =  Categories.find().lean()

  return categories
}

const getCategoriesByName = (category) => {
  console.log(category, 'this is our category');
  const categories = Categories.findOne({ category: category })

  console.log(categories.id, "this is the place where we get all articles by name");
}

// Alternative Approach for creating category
// const createCategory = async () => {
//   const categories = await 
// }

module.exports = {
  getCategories,
  getCategoriesByName
}