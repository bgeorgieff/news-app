const mongoose = require('mongoose')
const dbString = require('./config').dbURL //If using local DB you need to add here the name of the collection after +
const rdyString = `${'*'.repeat(10)} DB is ready! ${'*'.repeat(10)}`

module.exports = () => {
  return mongoose.connect(dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true,
  },
    console.log(rdyString)
  )
}