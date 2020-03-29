const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  image: {
    type: Buffer
  },
  categoryId: {
    type: String
  },
  dateCreated: {
    type: Date,
    required: [true, 'Created date is required']
  }
});

module.exports = communitySchema;
