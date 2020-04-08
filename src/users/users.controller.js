var mongoose   = require('mongoose');
var crypto = require('crypto');
var schema = require('./users.model');
var cors = require('cors');
var userSchema = require('./users.model');
var tokensSchema = require('../tokens/tokens.model');
var communitySchema = require('../communities/communities.model');
var chatroomsSchema = require('../chatrooms/chatrooms.model');
const Chatroom = mongoose.model('chatroom', chatroomsSchema, 'chatrooms');
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
				email: request.body.email,
				isVerified:false,
				profilePicture: request.body.profilePicture,
				dateCreated: new Date(),
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

			if (!community) {
				throw "Community not found";
			}

			if (user.communities) {
				user.communities.push(community._id);
			} else {
				user.communities = [community._id];
			}

			User.updateOne({ _id: userId }, user, (err, res) => {
				if (err)
					throw err;

				if (res)
					response.json({ success: true, user: user });
			})

		} catch (err) {
			response.send({success: false, message: err });
		}
	},

	addChatroom: async (request, response) => {
		try {
			var userId = request.body.userId;
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
				throw "Chatroom not found";
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
					response.json({ success: true, user: user });
			})

		} catch (err) {
			response.send({success: false, message: err });
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
					response.json({ success: false, message: err });
				}

				if (res) {
					response.json({ success: true, user: user });
				}
			});

		} catch (err) {
			response.send({success: false, message: err });
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
					response.json({ success: false, message: err });
				}
				if (res) {
					response.json({ success: true, user: user });
				}
			});
		} catch (err) {
			response.send({success: false, message: err });
		}
	},

	getCommunitiesFromUser: async (request, response) => {
		// request.params.user_id
		var user = await User.findById(request.params.user_id, "communities", (err) => {
			if (err) {
				response.json({success: false, message: err });
			}
		});

		Community.find({ '_id': { $in: user.communities } }, (err, res) => {
			if (err) {
				response.json({ success: false, message: err });
			}

			if (res) {
				response.json({ success: true, communities: res });
			}
		});
	},

	getChatroomsFromUser: async (request, response) => {
		User.findById(request.params.user_id, "chatrooms", (err, res) => {
			if (err)
				response.send({success: false, message: err });

			if (res)
				response.json({ success: true, chatrooms: res });
		});
	},


	verifyUser: async (request, response) => {
		
		var userEmailToken = await Token.findOne({ email: request.params.email });
		if (!userEmailToken) {
			response.json({ success: false, message: `token does not exist for user (${request.params.email})` });
			return (false)
		}

		var userEmail = await User.findOne({ email: request.params.email });
		if (!userEmail) {
			response.json({ success: false, message: `user does not exist for email (${request.params.email})` });
			return (false)
		}
			if(userEmail.isVerified == false){
					if(request.params.token == userEmailToken.token){ 

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
						response.json({ success: false, message: `invalid token (${request.body.token})` });
						return (false)
				}
			}else{
				response.json({ success: false, message: `email already verified (${request.body.email})` });

			}
	},

	sendVerification: async (request, response) => {

		var userEmail = await User.findOne({ email: request.body.email });
		if (!userEmail) {
			response.json({ success: false, message: `user does not exist for email (${request.body.email})` });
			return (false)
		}

			//create token
			var userToken = Math.floor(1000 + Math.random() * 9000);
			try {
				console.log(request.body.email);
				console.log(userToken.toString());
				const doc = await Token.findOneAndUpdate(
					{ email: request.body.email},
					{ token: userToken.toString() },
					// If `new` isn't true, `findOneAndUpdate()` will return the
					// document as it was _before_ it was updated.
					{ new: true }
				  );
				  console.log(doc.token);

			}
			catch (errToken) {
				console.log("error"+errToken);
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


			response.json({ success: true, message: `email verification sent at (${request.body.email})` });
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
		console.log(userToken);
		var existingtoken = await Token.findOne({email:request.body.email});
		
		if (!existingtoken) {
			
					//create token
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

		}else{

			try {
				console.log(request.body.email);
				console.log(userToken.toString());
				const doc = await Token.findOneAndUpdate(
					{ email: request.body.email},
					{ token: userToken.toString() },
					// If `new` isn't true, `findOneAndUpdate()` will return the
					// document as it was _before_ it was updated.
					{ new: true }
				  );
				  console.log(doc.token);

			}
			catch (errToken) {
				console.log(errToken);
			}

		}

	

		fs.readFile("./src/email/resetpassword.html", {encoding: 'utf-8'}, function (err, html) {
			if (err) {
				console.log(err);
			  }
			  else {
				  console.log("?email="+request.body.email+"&token="+userToken.toString())
				var customHTML = html.replace(/TOKENREPLACEMENT/g, "?email="+request.body.email+"&token="+userToken.toString());//tokenreplacement will be exchanged with real token and email


		let body = {

			from: process.env.EMAIL_USER,
			to: request.body.email,
			subject: "Self-Isomate - Reset Password",
			html:customHTML
		
		}
		
		
		transporter.sendMail(body, (errormail, resultmail)=>{

			if(errormail){
				console.log(errormail);
			}  
			console.log(resultmail);
			
		})


		response.json({ success: true, message: `email reset sent to (${request.body.email})` });
	}
	});


},



resetUser: async (request, response) => {
	console.log(typeof request+" request "+request);	
	console.log(typeof request.body +" body "+request.body);	
	var objRequest = JSON.parse(request.body);

	var userEmailToken = await Token.findOne({ email: objRequest.email }).catch(
		(err) =>{
		console.log(err);
	}
	);
	if (!userEmailToken) {
		response.json({ success: false, message: `token does not exist for user (${objRequest.email})` });
		return (false)
	}

	var userEmail = await User.findOne({ email: objRequest.email }).catch(
		(err) =>{
		console.log(err);
	}
	);
	if (!userEmail) {
		response.json({ success: false, message: `user does not exist for email (${objRequest.email})` });
		return (false)
	}
				if(objRequest.token == userEmailToken.token){ 
					userEmail.setPassword(objRequest.password);				
					User.findOneAndUpdate({email:objRequest.email}, userEmail, (err, res) => {
						if (err) {
							response.send({success: false, message: err });
						}
			
						if (res) {
							Token.deleteOne({ email:objRequest.email }, (err, res) => {
								if (err) {
									response.send({success: false, message: err });
								}
					
								if (res) {
									response.json({ success: true, message: `successfully password resetted for user (${objRequest.email})` });
								}
								
							});						
						}
					});

				}
				else{
					response.json({ success: false, message: `invalid token (${objRequest.token})` });
					return (false)
			}
		
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