const handler = require('../handlers/postCategory')
const router = require('express').Router()

router.post('/create', handler.post.createCategory)


module.exports = router