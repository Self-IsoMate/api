var mongoose   = require('mongoose');
var crypto = require('crypto');
var schema = require('./users.model');
var cors = require('cors');

var userSchema = require('./users.model');
var tokensSchema = require('../tokens/tokens.model');
var communitySchema = require('../communities/communities.model');
var chatroomsSchema = require('../chatrooms/chatrooms.model');
var postSchema = require('../posts/posts.model');

const Chatroom = mongoose.model('chatroom', chatroomsSchema, 'chatrooms');
const User = mongoose.model('user', userSchema, 'user_registration'); //export the model
const Community = mongoose.model('community', communitySchema, 'communities'); //export the model
const Token = mongoose.model('token', tokensSchema, 'tokens'); //export the model
const Post = mongoose.model('post', postSchema, 'posts');

const mailer = require("nodemailer");
require ('dotenv').config();
var fs = require('fs');

const transporter = mailer.createTransport({
    service:"Outlook365", 
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

//var bodyParser = require('body-parser');

const UserController = {
	addUser: async (request, response) => {
		try {

			var existingUser = await User.findOne({ username: request.body.username });

			if (existingUser && existingUser.username) {
				throw new Error("Username already exists");
			}

			existingUser = await User.findOne({ email: request.body.email });

			if (existingUser && existingUser.email) {
				throw new Error("Email already exists");
			}

			var user = new User({
				username: request.body.username,
				email: request.body.email,
				isVerified: false,
				profilePicture: request.body.profilePicture,
				dateCreated: new Date()
			});

			user.getDefaultPicture();

			user.setPassword(request.body.password);
			
			user.save((err) => {
				if (err) {
					response.json({ success: false, message: err.message });
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
						response.json({ success: false, message: errToken.message });
					}
			
					token.save((errToken) => {
						if (errToken) {
							response.json({ success: false, message: errToken.message });
						}
					});


					//send in the email

					fs.readFile("./src/email/email.html", {encoding: 'utf-8'}, function (err, html) {
						if (err) {
							response.json({ success: false, message: err.message });
						} else {
							var customHTML = html.replace(/TOKENREPLACEMENT/g, request.body.email+"/"+userToken.toString());

							let body = {
								from: process.env.EMAIL_USER,
								to: request.body.email,
								subject: "Welcome to Self-Isomate, please confirm email address",
								html: customHTML
							}
						
							transporter.sendMail(body, (errormail, resultmail) => {
								if (errormail) {
									response.json({ success: false, message: errormail.message });
								}  
							})

							response.json({ success: true, user: user });
						}
					});
				}
			});
		}
		catch (err) {
			if (err) {
				response.json({ success: false, message: err.message });
			}
		}
	},

	deleteUser: async (request, response) => {

		User.deleteOne({ _id: request.params.user_id }, (err, res) => {
			if (err) {
				response.send({success: false, message: err.message });
			}

			if (res) {
				response.json({ success: true });
			}
			
		});
	},

	updateUser: async (request, response) => {

		if (request.body.password) {

			User.findById(request.params.user_id, (err, res) => {
				if (err) {
					response.json({ success: false, message: err.message });
					return;
				}

				if (res) {
					var user = res;
					user.setPassword(request.body.password);

					User.findByIdAndUpdate(user._id, { salt: user.salt, hash: user.hash }, {new: true}, (err, res) => {
						if (err) {
							response.json({ success: false, message: err.message });
							return;
						}

						if (res) {
							response.json({ success: true, update: res });
							return;
						}
					});

				}
			});

		} else {

			User.findByIdAndUpdate(request.params.user_id, request.body, {new: true}, (err, res) => {
				if (err) {
					response.send({success: false, message: err.message });
				}

				if (res) {
					response.json({ success: true, update: res });
				}
			});
		}

	},

	findUser: async (req, res) => {
		var parameters = req.query;
		User.find(parameters, (error, response) => {
			if (error) {
				res.send({success: false, message: err.message });
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

			if (!community) {
				response.status(404);
				throw new Error("Community not found");
			}

			if (!user) {
				response.status(404);
				throw new Error("User not found");
			}

			if (user.communities) {
				user.communities.push(community._id);
			} else {
				user.communities = [community._id];
			}

			User.updateOne({ _id: userId }, user, (err, res) => {
				if (err) {
					response.status(500);
					throw err;
				}

				if (res) {
					response.status(200);
					response.json({ success: true, user: user });
				}
			})

		} catch (err) {
			response.send({success: false, message: err.message });
		}
	},

	addChatroom: async (request, response) => {
		try {
			var userId = request.params.user_id;
			var chatroomId = request.body.chatroomId;

			var user = await User.findById(userId, (err) => {
				if (err)
					throw err;
			})

			var chatroom = await Chatroom.findById(chatroomId, (err) => {
				if (err)
					throw err;
			})

			
			if (!chatroom) {
				throw new Error("Chatroom not found");
			}

			if (user.chatrooms) {
				user.chatrooms.push(chatroom._id);
			} else {
				user.chatrooms = [chatroom._id];
			}

			User.updateOne({ _id: userId }, user, (err, res) => {
				if (err)
					throw err;

				if (res)
					response.json({ success: true, user: user});
			})

		} catch (err) {
			response.send({success: false, message: err.message });
		}
	},

	removeCommunity: async (request, response) => {
		try {
			var userId = request.params.user_id;
			var communityId = request.params.community_id;

			var user = await User.findById(userId, (err) => {
				if (err) {
					throw err;
				}
			});

			if (user.communities && user.communities.length > 0) {
				user.communities = user.communities.filter(c => c != communityId);
			}

			User.findByIdAndUpdate(userId, user, (err, res) => {
				if (err) {
					response.json({ success: false, message: err.message });
				}

				if (res) {
					response.json({ success: true, user: user });
				}
			});

		} catch (err) {
			response.send({success: false, message: err.message });
		}
	},

	removeChatroom: async (request, response) => {
		try {
			var userId = request.params.user_id;
			var chatroomId = request.params.chatroom_id;
			var user = await User.findById(userId, (err) => {
				if (err) {
					throw err;
				}
			});
			
			if (user.chatrooms && user.chatrooms.length > 0) {
				user.chatrooms = user.chatrooms.filter(c => c != chatroomId);
			}
			User.findByIdAndUpdate(userId, user, (err, res) => {
				if (err) {
					response.json({ success: false, message: err.message });
				}
				if (res) {
					response.json({ success: true, user: user });
				}
			});
		} catch (err) {
			response.send({success: false, message: err.message });
		}
	},

	getCommunitiesFromUser: async (request, response) => {
		// request.params.user_id
		var user = await User.findById(request.params.user_id, "communities", (err) => {
			if (err) {
				response.json({success: false, message: err.message });
			}
		});

		Community.find({ '_id': { $in: user.communities } }, (err, res) => {
			if (err) {
				response.json({ success: false, message: err.message });
			}

			if (res) {
				response.json({ success: true, communities: res });
			}
		});
	},

	getChatroomsFromUser: async (request, response) => {
		User.findById(request.params.user_id, "chatrooms", (err, res) => {
			if (err)
				response.send({success: false, message: err.message });

			if (res)
				response.json({ success: true, chatrooms: res.chatrooms });
		});
	},


	verifyUser: async (request, response) => {
		
		var userEmailToken = await Token.findOne({ email: request.params.email });

		if (!userEmailToken) {
			response.status(404);
			response.json({ success: false, message: "Token not found" });
			return (false)
		}

		var userEmail = await User.findOne({ email: request.params.email });

		if (!userEmail) {
			response.status(404);
			response.json({ success: false, message: "User not found" });
			return (false)
		}

		if (userEmail.isVerified == false){
			if (request.params.token == userEmailToken.token){ 

				User.findOneAndUpdate({email:request.params.email}, {isVerified:true}, (err, res) => {
					if (err) {
						response.send({success: false, message: err.message });
					}

					if (res) {
						Token.deleteOne({ email:request.params.email }, (err, res) => {
							if (err) {
								response.send({ success: false, message: err.message });
							}

							if (res) {
								response.json({ success: true });
							}

						});
					}
				});
			} else{
				response.status(500);
				response.json({ success: false, message: "Invalid token" });
				return;
			}
		} else {
			response.status(400);
			response.json({ success: false, message: "Email already verified" });
		}
	},

	sendVerification: async (request, response) => {

		var userEmail = await User.findOne({ email: request.body.email });

		if (!userEmail) {
			response.status(404);
			response.json({ success: false, message: "User not found" });
			return (false)
		}

		//create token
		var userToken = Math.floor(1000 + Math.random() * 9000);

		try {
			const doc = await Token.findOneAndUpdate({ email: request.body.email}, { token: userToken.toString() }, { new: true });
		}
		catch (errToken) {
			response.json({ success: false, message: errToken.message });
		}

		fs.readFile("./src/email/email.html", {encoding: 'utf-8'}, function (err, html) {
			if (err) {
				response.json({success: false, message: err.message});
			}
			else {
				var customHTML = html.replace(/TOKENREPLACEMENT/g, request.body.email+"/"+userToken.toString());//tokenreplacement will be exchanged with real token and email

				let body = {
					from: process.env.EMAIL_USER,
					to: request.body.email,
					subject: "Welcome to Self-Isomate, please confirm email address",
					html:customHTML
				}

				transporter.sendMail(body, (errormail, resultmail)=>{
					if (errormail) {
						response.json({success: false, message: errormail.message});
					}
				});

				response.json({ success: true });
			}
		});
	},
	
	sendReset: async (request, response) => {

		var userEmail = await User.findOne({ email: request.body.email });
		if (!userEmail) {
			response.json({ success: false, message: `user does not exist for email (${request.body.email})` });
			return (false)
		}

		var userToken = Math.floor(1000 + Math.random() * 9000);
		var existingtoken = await Token.findOne({ email: request.body.email });
		
		if (!existingtoken) {
			
			//create token
			try {
				var token = new Token({
					email: request.body.email,
					token: userToken.toString()             
				});
	
			} catch (errToken) {
				response.json({success: false, message: errToken.message});
			}
	
			token.save((errToken) => {
				if (errToken) {
					response.json({success: false, message: errToken.message});
				}
			});

		} else {

			try {
				const doc = await Token.findOneAndUpdate( { email: request.body.email}, { token: userToken.toString() }, { new: true });
			} catch (errToken) {
				response.json({success: false, message: errToken.message});
			}

		}

		fs.readFile("./src/email/resetpassword.html", {encoding: 'utf-8'}, (err, html) => {
			if (err) {
				response.json({success: false, message: err.message});
			} else {
				var customHTML = html.replace(/TOKENREPLACEMENT/g, "?email="+request.body.email+"&token="+userToken.toString());//tokenreplacement will be exchanged with real token and email
				
				let body = {
					from: process.env.EMAIL_USER,
					to: request.body.email,
					subject: "Self-Isomate - Reset Password",
					html: customHTML
				}
			
			
				transporter.sendMail(body, (errormail, resultmail) => {
					if(errormail){
						response.json({success: false, message: errormail.message});
					} 
				});
				
				response.json({ success: true });
			}
		});
	},

	resetUser: async (request, response) => {
		var objRequest = JSON.parse(request.body);

		var userEmailToken = await Token.findOne({ email: objRequest.email })
			.catch((err) => {
				if (err) {
					response.json({success: false, message: err.message});
				}
			});

		if (!userEmailToken) {
			response.json({ success: false, message: `token does not exist for user (${objRequest.email})` });
			return (false)
		}

		var userEmail = await User.findOne({ email: objRequest.email })
			.catch((err) => {
				if (err) {
					response.json({success: false, message: err.message});
				}
			});

		if (!userEmail) {
			response.json({ success: false, message: `user does not exist for email (${objRequest.email})` });
			return (false)
		}

		if (objRequest.token == userEmailToken.token) { 
			userEmail.setPassword(objRequest.password);				
			User.findOneAndUpdate({email:objRequest.email}, userEmail, (err, res) => {
				if (err) {
					response.send({success: false, message: err.message });
				}
	
				if (res) {
					Token.deleteOne({ email:objRequest.email }, (err, res) => {
						if (err) {
							response.send({success: false, message: err.messsage });
						}
			
						if (res) {
							response.json({ success: true });
						}
						
					});						
				}
			});
		} else {
			response.json({ success: false, message: `Invalid token (${objRequest.token})` });
			return (false)
		}	
	},


	requestLogin: async (request, response) => {
		var username = request.body.username;
		var password = request.body.password;

		User.findOne({ username: username }, (err, res) => {
			if (err) {
				response.json({ loginSuccess: false, message: err });
			}

			if (res) {
				if (res.validPassword(password)) {
					response.json({ loginSuccess: true, user: res })
				} else {
					response.json({ loginSuccess: false, message: "Incorrect password" })
				}
			}

			if (!res) {
				response.json({ loginSuccess: false, message: "Incorrect username/password" });
			}

		});
	},

	getFeed: async (request, response) => {
		var status;

		try {
			var userId = mongoose.Types.ObjectId(request.params.user_id);

			var user = await User.findById(userId, (err) => {
				if (err) {
					status = 500;
					throw err;
				}
			});

			if (!user) {
				status = 404;
				throw new Error("User not found");
			}

			var communities = user.communities.map((c) => c.toString());

			Post.find({ communities: { $in: communities } }, null, { sort: { 'datePosted': -1 } }, (err, res) => {
				if (err) {
					status = 500;
					throw err;
				}

				if (res) {
					response.status(200);
					response.json({ success: true, feed: res });
				}
			});


		} catch (err) {
			status = status || 500;
			response.status(status);
			response.json({ success: false, message: err.message });
		}
	}
};

module.exports = UserController;