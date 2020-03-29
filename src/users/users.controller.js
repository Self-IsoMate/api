/*

	The point of this class is to separate the mongoose/mongodb methods and functions from
	the routing/endpoint logic that is in main.js

	endpoints to do:
	- delete user
	- update user
	- get user by id
	- get user by username
	- get all the users
	- get all the users by a bunch of filters

*/

var mongoose   = require('mongoose');
var schema = require('./users.model');
var cors = require('cors');

const UserController = {
	addUser: async (request, response) => {
		var user = new User({
			username: request.body.username,
			password: request.body.password,
			isMentor: request.body.isMentor,
			mentorSubjects: request.body.mentorSubjects,
			email: request.body.email,
			interests: request.body.interests,
			profilePicture: request.body.profilePicture,
			dateCreated: request.body.dateCreated
		});

		user.save((err) => {
			if (err) {
				response.send(err);
			} else {
				response.json({ success: true, user: user });
			}
		});
	}
};

module.exports = UserController;