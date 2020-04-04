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
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'User is required']
  },
  communities: {
    type: Array,
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
