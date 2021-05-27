const router = require('express').Router()
const handler = require('../handlers/comments')
const isAuth = require('../utils/isAuth')

router.post('/comment-add/:id', isAuth(), handler.post.createPost)
router.post('/reply/:id', isAuth(), handler.post.reply)

module.exports = router 