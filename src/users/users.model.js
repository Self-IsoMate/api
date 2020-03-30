const mongoose = require('mongoose')

const User = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  isMentor: {
    type: Boolean
  },
  mentorSubjects: {
    type: Array
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  interests: {
    type: Array
  },
  profilePicture: {
    type: Buffer
  },
  dateCreated: {
    type: Date,
    required: [true, 'Date created is required']
  },
  communities: {
    type: Array
  }
})

module.exports = User;
