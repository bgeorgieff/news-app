const router = require('express').Router()
const handler = require('../handlers/user')
const isAuth = require('../utils/isAuth')

router.get('/login', handler.get.login) 
router.get('/register', handler.get.register) 

router.get('/logout', handler.get.logout)

router.post('/register', handler.post.register)
router.post('/login', handler.post.login)

module.exports = router