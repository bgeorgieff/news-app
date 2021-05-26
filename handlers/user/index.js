  const User = require('./User')
  const jwt = require('../../utils/jwt')
  const { cookie } = require('../../config/config')
  const { secret } = require('../../config/config') 
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
          console.log(err);
        }) 

    },
    register (req, res, next) {
      const {username, password, rePassword, adminAuth} = req.body
  
      const isAuthenticated = adminValidation(adminAuth)

      // TODO IMPLEMENT MESSAGES ON WEBPAGE
      if(password !== rePassword) {
        return res.render('./users/register.hbs', {
            message: "Your passwords don't match",
            oldDetails: {username, password, rePassword}
        })
      }

      User.create({username, password, isAdmin: isAuthenticated})
        .then((user) => {
          const token = jwt.createToken(user)
          res
          .cookie(cookie, token, {maxAge: 360000000})
          .redirect('/home')
        })
    }
  }
}

