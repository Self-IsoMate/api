var mongoose   = require('mongoose');
var crypto = require('crypto');
var schema = require('./users.model');
var cors = require('cors');
var userSchema = require('./users.model');
var tokensSchema = require('../tokens/tokens.model');
var communitySchema = require('../communities/communities.model');
const User = mongoose.model('user', userSchema, 'user_registration'); //export the model
const Community = mongoose.model('community', communitySchema, 'communities'); //export the model
const Token = mongoose.model('token', tokensSchema, 'tokens'); //export the model

const mailer = require("nodemailer");
require ('dotenv').config();
var fs = require('fs');

const transporter = mailer.createTransport({
    service:"Outlook365", //
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

var bodyParser = require('body-parser');

const UserController = {
	addUser: async (request, response) => {
		try {

			var existingUser = await User.findOne({ username: request.body.username });

			if (existingUser && existingUser.username) {
				throw "username already used";
			}

			existingUser = await User.findOne({ email: request.body.email });

			if (existingUser && existingUser.email) {
				throw "email already used";
			}

			var user = new User({
				username: request.body.username,
				password: request.body.password,
				isMentor: request.body.isMentor,
				mentorSubjects: request.body.mentorSubjects,
				email: request.body.email,
				isVerified:false,
				interests: request.body.interests,
				profilePicture: request.body.profilePicture,
				dateCreated: new Date(),
				// Setting to default profile picture
				profilePicture: 'https://storage.cloud.google.com/self-isomate-images/profile-pictures/default-profile-pic.png'
			});

			user.setPassword(request.body.password);
			
			user.save((err) => {
				if (err) {
					response.send(err);
				} else {

					//create token
					var userToken = Math.floor(1000 + Math.random() * 9000);
					try {
						var token = new Token({
							email: request.body.email,
							token: userToken.toString()             
						});
			
					}
					catch (errToken) {
						console.log(errToken);
					}
			
					token.save((errToken) => {
						if (errToken) {
							response.send(errToken);
						} else {
							console.log(token);
						}
					});


					//send in the email

					fs.readFile("./src/email/email.html", {encoding: 'utf-8'}, function (err, html) {
						if (err) {
							console.log(err);
						  }
						  else {
							  console.log(request.body.email+"/"+userToken.toString())
							var customHTML = html.replace(/TOKENREPLACEMENT/g, request.body.email+"/"+userToken.toString());//tokenreplacement will be exchanged with real token and email


					let body = {

						from: process.env.EMAIL_USER,
						to: request.body.email,
						subject: "Welcome to Self-Isomate, please confirm email address",
						html:customHTML
					
					}
					
					
					transporter.sendMail(body, (errormail, resultmail)=>{

						if(errormail){
							console.log(errormail);
						}  
						console.log(resultmail);
						
					})
  

					response.json({ success: true, user: user });
					}
				});
				}
			});
		}
		catch (err) {
			response.json({ success: false, message: err });
		}
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
				res.send({success: false, message: err });
			}
			if (response) {
				res.json({ success: true, users: response });
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
	},

	verifyUser: async (request, response) => {
		console.log(request.params.email);

		var userEmailToken = await Token.findOne({ email: request.params.email });
		var userEmail = await User.findOne({ email: request.params.email });

			console.log(userEmail.isVerified);
			console.log(userEmailToken.token);


			if(userEmail.isVerified == false){
					if(request.params.token == userEmailToken.token){ //email non verificata

						User.findOneAndUpdate({email:request.params.email}, {isVerified:true}, (err, res) => {
							if (err) {
								response.send({success: false, message: err });
							}
				
							if (res) {
								Token.deleteOne({ email:request.params.email }, (err, res) => {
									if (err) {
										response.send({success: false, message: err });
									}
						
									if (res) {
										response.json({ success: true, message: `successfully Email verified (${request.params.email})` });
									}
									
								});
							}
						});

					}
					else{
					console.log("invalid token");
					return (false)
				}
			}else{
				console.log("Email already verified");

			}
	},

	sendVerification: async (request, response) => {

			//create token
			var userToken = Math.floor(1000 + Math.random() * 9000);
			try {
				Token.findOneAndUpdate({email:request.body.email},{token:userToken.toString()})
			}
			catch (errToken) {
				console.log(errToken);
			}

			fs.readFile("./src/email/email.html", {encoding: 'utf-8'}, function (err, html) {
				if (err) {
					console.log(err);
				  }
				  else {
					  console.log(request.body.email+"/"+userToken.toString())
					var customHTML = html.replace(/TOKENREPLACEMENT/g, request.body.email+"/"+userToken.toString());//tokenreplacement will be exchanged with real token and email


			let body = {

				from: process.env.EMAIL_USER,
				to: request.body.email,
				subject: "Welcome to Self-Isomate, please confirm email address",
				html:customHTML
			
			}
			
			
			transporter.sendMail(body, (errormail, resultmail)=>{

				if(errormail){
					console.log(errormail);
				}  
				console.log(resultmail);
				
			})


			response.json({ success: true, user: user });
			}
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
						loginSuccess: true,
						user: res
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