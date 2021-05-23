const router = require('express').Router()
const handler = require('../handlers/articles')
const isAuth = require('../utils/isAuth')

router.get('/create', isAuth(), handler.get.postArticle)
router.get('/post/:id', isAuth(true), handler.get.viewArticle)
router.get('/edit-post/:id', isAuth(), handler.get.editArticleView)
router.get('/delete/:id', isAuth(), handler.delete.deleteArticle)

router.post('/create', isAuth(), handler.post.postArticle)
router.post('/create/create-category', isAuth(), handler.post.addCategory)
router.post('/edit-post/:id', isAuth(), handler.put.editArticle)

module.exports = router