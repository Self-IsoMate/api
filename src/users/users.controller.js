var mongoose   = require('mongoose');
var crypto = require('crypto');
var schema = require('./users.model');
var cors = require('cors');
var userSchema = require('./users.model');
var communitySchema = require('../communities/communities.model');
const User = mongoose.model('user', userSchema, 'user_registration'); //export the model
const Community = mongoose.model('community', communitySchema, 'communities'); //export the model

var bodyParser = require('body-parser');

const UserController = {
	addUser: async (request, response) => {
		try {
			var existingUser = await User.find({ username: request.body.username });

			if (existingUser && existingUser.username) {
				throw "username already used";
			}

			existingUser = await User.find({ email: request.body.email });

			if (existingUser && existingUser.email) {
				throw "email already used";
			}

			var user = new User({
				username: request.body.username,
				password: request.body.password,
				isMentor: request.body.isMentor,
				mentorSubjects: request.body.mentorSubjects,
				email: request.body.email,
				interests: request.body.interests,
				profilePicture: request.body.profilePicture,
				dateCreated: new Date()
			});
			
			console.log("here");

			user.setPassword(request.body.password);

			console.log(user.hash);

			user.save((err) => {
				if (err) {
					response.send(err);
				} else {
					response.json({ success: true, user: user });
				}
			});
		}
		catch (err) {
			response.send(err);
		}
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
	},

	updateUser: async (request, response) => {

		User.findByIdAndUpdate(request.params.user_id, request.body, (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, update: res });
			}
		});

	},

	findUser: async (req, res) => {
		var parameters = req.query;
		User.find(parameters, (error, response) => {
			if (error) {
				res.send(error);
			}
			if (response) {
				res.send(response);
			}
		});
	},

	addCommunity: async (request, response) => {
		try {
			var userId = request.body.userId || request.params.user_id;
			var communityId = request.body.communityId;

			var user = await User.findById(userId, (err) => {
				if (err)
					throw err;
			})

			var community = await Community.findById(communityId, (err) => {
				if (err)
					throw err;
			})

			if (user.communities) {
				user.communities.push(community);
			} else {
				user.communities = [community];
			}

			User.updateOne({ _id: userId }, user, (err, res) => {
				if (err)
					throw err;

				if (res)
					response.send(res);
			})

		} catch (err) {
			response.send(err);
		}
	},

	removeCommunity: async (request, response) => {
		try {
			var userId = request.params.user_id;
			var communityId = request.body.communityId;

			var user = User.findById(userId, (err) => {
				if (err)
					throw err;
			});

			user.communities = user.communities.filter(c => c._id != communityId);

			console.log(user.communities);

			User.findByIdAndUpdate(userId, user, (err, res) => {
				if (err)
					throw err;

				if (res)
					response.send(res);
			})

		} catch (err) {
			response.send(err);
			console.log(err);
		}
	},

	getCommunitiesFromUser: async (request, response) => {
		User.findById(request.params.user_id, "communities", (err, res) => {
			if (err)
				response.send(err);

			if (res)
				response.send(res);
		});
	},

	requestLogin: async (request, response) => {
		var username = request.body.username;
		var password = request.body.password;

		User.findOne({ username: username }, (err, res) => {
			if (err)
				response.send(err);

			if (res) {
				if (res.validPassword(password)) {
					response.json({
						loginSuccess: true
					})
				} else {
					response.json({
						loginSuccess: false
					})
				}
			}

		});
	}
};

module.exports = UserController;