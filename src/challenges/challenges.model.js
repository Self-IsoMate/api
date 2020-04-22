const mongoose = require('mongoose')

const schema = new mongoose.Schema({

  title:{
    type: String,
    required: [true, 'Title is required']
  },
  image: {
    type: String
  },
  description: {
    type: String,
    required: [true, 'Description is required']  
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']  
  },
  communities: {
    type: [String]
  }
});

module.exports = schema;
