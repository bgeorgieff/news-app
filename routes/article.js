const router = require('express').Router()
const handler = require('../handlers/articles')
const isAuth = require('../utils/isAuth')

router.get('/create', isAuth(), handler.get.postArticle)
router.get('/:id', isAuth(true), handler.get.viewArticle)

router.post('/create', isAuth(), handler.post.postArticle)

module.exports = router