const adminSecret = require('../config/config').adminSecret

const adminValidation = (data) => {
  if (data === adminSecret) {
    return !!adminAuth
  } else {
    return false
  }
}

module.exports = {
  adminValidation
}