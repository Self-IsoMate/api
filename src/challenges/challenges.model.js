const mongoose = require('mongoose')

const schema = new mongoose.Schema({

  title:{
    type: String,
    required: [true, 'Title is required']
  },
  image: {
    type: Buffer
  },
  description: {
    type: String,
    required: [true, 'Description is required']  
  },
  community: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Community is required']  
  }

});

module.exports = schema;
