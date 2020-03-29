var mongoose   = require('mongoose');
var schema = require('./users.model');
var cors = require('cors');
var userSchema = require('./users.model');
const User = mongoose.model('user', userSchema, 'user_registration'); //export the model
var bodyParser = require('body-parser');

const UserController = {
	addUser: async (request, response) => {

		try {
			var user = new User({
				username: request.body.username,
				password: request.body.password,
				isMentor: request.body.isMentor,
				mentorSubjects: request.body.mentorSubjects,
				email: request.body.email,
				interests: request.body.interests,
				profilePicture: request.body.profilePicture,
				dateCreated: Date.parse(request.body.dateCreated)
			});

		}
		catch (err) {
			console.log(err);
		}

		user.save((err) => {
			if (err) {
				response.send(err);
			} else {
				response.json({ success: true, user: user });
			}
		});
	},

	deleteUser: async (request, response) => {

		User.deleteOne({ _id: request.params.user_id }, (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, message: `successfully deleted user (${request.params.user_id})` });
			}
			
		});
	}
};

module.exports = UserController;