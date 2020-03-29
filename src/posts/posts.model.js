const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  media: {
    type: Buffer
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
    type: String,
    required: [true, 'User is required']
  },
  communityId: {
    type: String,
    required: [true, 'Community is required']
  },
  datePosted: {
    type: Date,
    required: [true, 'Posted date is required']
  }
})

module.exports = userSchema
