const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  image: {
    type: Buffer
  },
  category: {
    type: String
  },
  dateCreated: {
    type: Date,
    required: [true, 'Created date is required']
  }
})

module.exports = userSchema
