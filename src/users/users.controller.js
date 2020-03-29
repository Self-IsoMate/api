var mongoose   = require('mongoose');
var schema = require('./users.model');
var cors = require('cors');
var userSchema = require('./users.model');
const User = mongoose.model('user', userSchema, 'user_registration'); //export the model

const UserController = {
	addUser: async (request, response) => {
		var user = new userSchema({
			username: request.body.username,
			password: request.body.password,
			isMentor: request.body.isMentor,
			mentorSubjects: request.body.mentorSubjects,
			email: request.body.email,
			interests: request.body.interests,
			profilePicture: request.body.profilePicture,
			dateCreated: request.body.dateCreated
		});

		console.log("user done");

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