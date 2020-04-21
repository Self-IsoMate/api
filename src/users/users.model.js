const mongoose = require('mongoose');
const crypto = require('crypto');


/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - username
 *          - email
 *          - isVerified
 *          - dateCreated
 *          - hash
 *          - salt
 *        properties:
 *          username:
 *            type: string
 *            description: Username of the user.
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          isVerified:
 *            type: boolean
 *            description: Flag to show whether a user has verified their email or not.
 *          profilePicture:
 *            type: string
 *            description: URL to user's profile picture.
 *          dateCreated:
 *            type: date
 *            description: Date the account was created.
 *          communities:
 *            type: array
 *            items:
 *              type: string
 *            description: List of community IDs the user is subscribed to.
 *          chatrooms:
 *            type: array
 *            items:
 *              type: string
 *            description: List of chatroom IDs the user has added.
 *          hash:
 *            type: string
 *          salt:
 *            type: string
 *          bio:
 *            type: string
 *            description: User Bio
 *        example:
 *            username: alexndr1
 *            email: a.andr@fake.com
 *            isVerified: false
 *            dateCreated: 01/01/2001
 *            hash: 19024432sbdflksdjfdsf
 *            salt: sanasdfsdfndsfwqr98q3
 */

var User = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  isVerified: {
    type: Boolean,
    required: [true, 'isVerified is required'] //made default "no"
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
  chatrooms: {
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

User.methods.getDefaultPicture = function() {
  var picture_id = Math.floor((Math.random() * 20) + 1);
  this.profilePicture =  'https://storage.googleapis.com/self-isomate-images/profile-pictures/default/' + picture_id + ".png"
};

User.methods.validPassword = function(password) { 
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
	return this.hash === hash; 
};

module.exports = User;
