const router = require('express').Router()
const handler = require('../handlers/articles')
const isAuth = require('../utils/isAuth')
const validations = require('../utils/validator')

router.get('/create', isAuth(), handler.get.postArticle)
router.get('/post/:id', isAuth(true), handler.get.viewArticle)
router.get('/edit-post/:id', isAuth(), handler.get.editArticleView)
router.get('/delete/:id', isAuth(), handler.delete.deleteArticle)
router.get('/all-posts', isAuth(true), handler.get.viewAll)
router.get('/result/view', isAuth(true), handler.get.searchResult)

router.post('/create', isAuth(), validations, handler.post.postArticle)
router.post('/create/create-category', isAuth(), handler.post.addCategory)
router.post('/edit-post/:id', isAuth(), validations, handler.put.editArticle)

module.exports = router