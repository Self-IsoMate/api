const mongoose = require('mongoose')

const chatroomsSchema = new mongoose.Schema({

  chatroomName:{
    type: String,
    required: [true, 'Chatroom name is required']
  },
  chatroomPicture: {
    type: String
  },
  communities: {
    type: [String]
  }
});

module.exports = chatroomsSchema;
