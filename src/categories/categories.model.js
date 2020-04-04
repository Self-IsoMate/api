const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  image: {
    type: String
  },
  subcategories: {
    type: Array
  },
  isSubcategory: {
    type: Boolean,
    required: [true, 'isSubcategory flag is required']
  }
});

module.exports = schema;
