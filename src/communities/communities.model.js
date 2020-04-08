const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  image: {
    type: String
  }
});

module.exports = communitySchema;
