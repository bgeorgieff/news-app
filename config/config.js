const env = process.env.NODE_ENV || 'development'

const config = {
  development: {
    port: process.env.PORT,
    dbURL: process.env.DB_URL,
    cookie: 'f-auth-token',
    secret: process.env.PRIVATE_KEY,
    adminSecret: process.env.ADMIN_SECRET
  },

  production: {
    
  }
}

module.exports = config[env]