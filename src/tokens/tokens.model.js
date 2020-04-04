const mongoose = require('mongoose')

const schema = new mongoose.Schema({

 email: {
        type: String,
        required: [true, 'Email is required']
  },
  token: {
    type: String,
    required: [true, 'Token is required']
  }

});

module.exports = schema;
