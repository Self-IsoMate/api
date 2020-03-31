const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  image: {
    type: String
  },
  parentCategoryId: {
    type: String
  }
});

module.exports = schema;
