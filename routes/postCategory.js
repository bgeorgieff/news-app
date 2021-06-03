const handler = require('../handlers/postCategory')
const router = require('express').Router()
const isAuth = require('../utils/isAuth')

router.get('/view/:id', isAuth(true), handler.get.getCategory)

router.post('/create', handler.post.createCategory)

module.exports = router