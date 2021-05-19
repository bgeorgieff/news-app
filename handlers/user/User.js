const mongoose = require('mongoose')
const { ObjectID } = require('bson')
const { Schema, model: Model } = mongoose
const { String, ObjectId } = Schema.Types
const bcrypt = require('bcrypt')
const saltRounds = 10

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  articleHistory: [{
    type: ObjectId,
    ref: 'Articles'
  }]
})

userSchema.methods = {
	passwordMatch(password) {
		return bcrypt.compare(password, this.password)
	}
}

userSchema.pre('save', function(next) {
	if (this.isModified('password')) {

		bcrypt.genSalt(saltRounds, (err, salt) => {
			if (err) {
				return next(err)
			}
	
			bcrypt.hash(this.password, salt, (err, hash) => {
				if (err) {
					return next(err)
				}
	
				this.password = hash
				next()
			})
		})
		return
	}
	
	next()
})

module.exports = new Model('User', userSchema)