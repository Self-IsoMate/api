const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Category is required']
  },
  communities: {
	  type: Array,
	  required: [true, 'At least one community is required']
  },
  dateCreated: {
	  type: Date,
	  required: [true, 'Created date is required']
  }
});

module.exports = schema;
