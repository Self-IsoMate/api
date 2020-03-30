var mongoose   = require('mongoose');
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
				response.send({success: false, message: err });
			} else {
				response.json({ success: true, user: user });
			}
		});
	},

	deleteUser: async (request, response) => {

		User.deleteOne({ _id: request.params.user_id }, (err, res) => {
			if (err) {
				response.send({success: false, message: err });
			}

			if (res) {
				response.json({ success: true, message: `successfully deleted user (${request.params.user_id})` });
			}
			
		});
	},

	updateUser: async (request, response) => {

		User.findByIdAndUpdate(request.params.user_id, request.body, (err, res) => {
			if (err) {
				response.send({success: false, message: err });
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
				response.send({success: false, message: err });
			}
			if (response) {
				response.json({ success: true, user: response });
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
					response.json({ success: true, user: res });
			})

		} catch (err) {
			response.send({success: false, message: err });
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
					response.json({ success: true, user: res });
			})

		} catch (err) {
			response.send({success: false, message: err });
		}
	},

	getCommunitiesFromUser: async (request, response) => {
		User.findById(request.params.user_id, "communities", (err, res) => {
			if (err)
				response.send({success: false, message: err });

			if (res)
				response.json({ success: true, communities: user });
		});
	}
};

module.exports = UserController;