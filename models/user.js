const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: {
    type: String
  },
  name: {
    type: String
  },
  passwordHash: String,
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.paswordHash
  }
})

const User = model('User', userSchema)

module.exports = User
