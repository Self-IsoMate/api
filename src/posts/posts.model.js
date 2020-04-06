const mongoose = require('mongoose')

const postsSchema = new mongoose.Schema({
  media: {
    type: String
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  body: {
    type: String,
    required: [true, 'Body is required']
  },
  userId: {
    type: String, // changed to refer to user id in case user details change
    required: [true, 'User is required']
  },
  communities: {
    type: Array, // this should be an array of community ids
    required: [true, 'Community is required']  
  },
  datePosted: {
    type: Date,
  },
  dateEdited: {
    type: Date
  }
})

module.exports = postsSchema
