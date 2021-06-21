const handler = require('../handlers/postCategory')
const tagHandler = require('../handlers/categories')
const router = require('express').Router()
const isAuth = require('../utils/isAuth')

router.get('/view/:id', isAuth(true), handler.get.getCategory)
router.get('/tags/view-all/:id', isAuth(true), tagHandler.get.getPerTag)

router.post('/create', handler.post.createCategory)

module.exports = router