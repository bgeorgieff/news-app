const adminSecret = require('../config/config').adminSecret

const adminValidation = (data) => {
  if (data === adminSecret) {
    return !!data
  } else {
    return false
  }
}

module.exports = {
  adminValidation
}