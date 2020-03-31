const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  image: {
    type: String
  },
  categoryId: {
    type: String,
    required: [true, 'categoryId is required']
  },
  dateCreated: {
    type: Date,
    required: [true, 'Created date is required']
  }
});

module.exports = communitySchema;
