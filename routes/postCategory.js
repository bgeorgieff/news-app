const handler = require('../handlers/postCategory')
const router = require('express').Router()

router.get('/view/:id', handler.post.createCategory)

router.post('/create', handler.post.createCategory)

module.exports = router