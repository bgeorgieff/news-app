const router = require('express').Router()
const handler = require('../handlers/home')
const isAuth = require('../utils/isAuth')

router.get('/home', isAuth(), handler.get.home)
router.get('/', isAuth(), handler.get.home)

module.exports = router
