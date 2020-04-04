const mongoose = require('mongoose');
const crypto = require('crypto');

var User = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  isMentor: {
    type: Boolean
  },
  mentorSubjects: {
    type: Array
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  isVerified: {
    type: Boolean,
    required: [true, 'isVerified is required'] //make default "no"

  },
  interests: {
    type: Array
  },
  profilePicture: {
    type: String
  },
  dateCreated: {
    type: Date,
    required: [true, 'Date created is required']
  },
  communities: {
    type: Array
  },
  hash: {
    type: String,
    required: [true, 'Hash required']
  },
  salt: {
    type: String,
    required: [true, 'Salt required']
  },
  bio: {
    type: String
  }
});

// method for hashing password

User.methods.setPassword = function(password) { 
	this.salt = crypto.randomBytes(16).toString('hex'); 
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
	console.log(this);
};

User.methods.validPassword = function(password) { 
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
	return this.hash === hash; 
};

module.exports = User;
