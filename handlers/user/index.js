const User = require('./User')
const jwt = require('../../utils/jwt')
const { cookie } = require('../../config/config')
const { adminValidation } = require('../../utils/helpers')

module.exports = {
  get: {
    login(req, res, next) {
      res.render('./users/login')
    },
    register(req, res, next) {
      res.render('./users/register')
    },
    logout(req, res, next) {
      req.user = null
      res.clearCookie(cookie).redirect('/home')
    }
  },

  post: {
    login (req, res, next) {
      const {username, password} = req.body

      if (!username) {
        return res.render('./users/login', {
          message: "You must use an existing user"
        })
      }

      if (!password) {
        return res.render('./users/login', {
          message: "You must use your password"
        })
      }

      User.findOne({ username })
        .then((user) => {
          return Promise.all([user.passwordMatch(password), user])
        })
        .then(([match, user]) => {
            if (!match) {
              next(err)
              return
            }
            const token = jwt.createToken(user)
            res.status(201)
              .cookie(cookie, token, {maxAge: 3600000000})
              .redirect('/')
        })
        .catch(err => {
          if (err) {
            return res.render('./users/login', {
              message: "There is no such user or passwords don't match"
            })
          }
        }) 

    },
    register (req, res, next) {
      const {username, password, rePassword, adminAuth} = req.body
  
      const isAuthenticated = adminValidation(adminAuth)

      if(password !== rePassword) {
        return res.render('./users/register.hbs', {
            message: "Your passwords don't match",
            oldDetails: {username, password, rePassword}
        })
      }

      if (!username) {
        return res.render('./users/register.hbs', {
            message: "You must choose a username"
        })
      }

      if (!password) {
          return res.render('./users/register.hbs', {
              message: "You must choose a password"
          })
      }

      User.create({username, password, isAdmin: isAuthenticated})
        .then((user) => {
          const token = jwt.createToken(user)
          res
          .cookie(cookie, token, {maxAge: 360000000})
          .redirect('/home')
        })
        .catch((err) => {
          if(err) {
            res.render('./users/register.hbs', {
              message: "There's something wrong with this user...try another one"
            })
          }
        })
    }
  }
}

