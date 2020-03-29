var mongoose   = require('mongoose');
var schema = require('./users.model');
var cors = require('cors');
const User = mongoose.model('user', userSchema, 'user_registration'); //export the model

const UserController = {
	addUser = async (request, response) => {
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
	},

	getUser = async (req, res) => {
		return new Promise( (resolve, reject) => 
			{
				User.findOne(req.params.cust_id, (err, customer) => {
					if (err) {
						return reject({sucess: false, response: err});
					} else if (!customer) {
						return reject({sucess: false, response: 'No customer found'});
					} else {
						return resolve({sucess: true, response: customer});
					}
				})
			}
		);
	}

};



modules.exports = UserController;