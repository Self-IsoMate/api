const mongoose = require('mongoose')

const schema = new mongoose.Schema({

  userID:{
    type: String,
    required: [true, 'ID of the user is required']
  },
  chatroomID:{
    type: String,
    required: [true, 'ID of the chatroom is required']
  },
  message : {
    type: String,
    required: [true, 'Body of the message is required']  
  },
  dateSent: {
    type: Date,
    required: [true, 'Date of message creation is required']
  }
});

module.exports = schema;
