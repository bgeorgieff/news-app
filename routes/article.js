const router = require('express').Router()
const handler = require('../handlers/articles')
const isAuth = require('../utils/isAuth')

router.get('/create', isAuth(), handler.get.postArticle)
router.get('/post/:id', isAuth(true), handler.get.viewArticle)
router.get('/edit-post/:id', isAuth(), handler.get.editArticleView)

router.post('/create', isAuth(), handler.post.postArticle)

router.post('/edit-post/:id', isAuth(), handler.put.editArticle)

router.get('/delete/:id', isAuth(), handler.delete.deleteArticle)

module.exports = router