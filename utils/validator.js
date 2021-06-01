const { body } = require('express-validator')

module.exports = [
  body('postCategory')
    .custom((value) => {
      if(!value) {
        throw new Error('You have to choose post Category')
      }
      return true
  }),
  body('title')
    .custom((value) => {
        if(!value) {
          throw new Error('You have to choose post title')
        }
      return true
  }),
  body('post')
    .custom((value) => {
      if(!value) {
        throw new Error('There must be a post ...')
      }
      return true
  }),
]