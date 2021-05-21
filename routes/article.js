const router = require('express').Router()
const handler = require('../handlers/articles')
const isAuth = require('../utils/isAuth')

router.get('/create', isAuth(), handler.get.postArticle)
router.get('/post/:id', isAuth(true), handler.get.viewArticle)
router.get('/edit-post/:id', isAuth(), handler.get.editArticle)

router.post('/create', isAuth(), handler.post.postArticle)

module.exports = router