const jwt = require('jsonwebtoken')
const { secret } = require('../config/config')

module.exports = {
  createToken(data) {
    return jwt.sign({_id: data._id}, secret, {expiresIn: '35000000'})
  },
  verifyToken(token) {
    return new Promise((res, rej) => {
      jwt.verify(token, secret, (err, data) => {
        if (err) {
          rej(err)
          return
        }

        res(data)
        return
      })
    })
  }
}