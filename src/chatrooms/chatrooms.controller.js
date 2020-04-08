var mongoose   = require('mongoose');
var chatroomsSchema = require('./chatrooms.model');
var communitySchema = require('../communities/communities.model');
const Chatroom = mongoose.model('chatroom', chatroomsSchema, 'chatrooms');
const Community = mongoose.model('community', communitySchema, 'communities');

const chatroomsController = {
    addChatrooms: async (request, response) => {

		try {
            var existingChatrooms = await Chatroom.find({chatroomName: request.body.chatroomName}, (err) => {
                if (err){
                    console.log(err)
                }
            })
            var existingCommunities = await Community.find({ '_id': { $in: request.body.communities }}, (err) => {
                if (err){
                    console.log(err)
                }
            })
            if (existingChatrooms.length == 0 && (existingCommunities.length == request.body.communities.length)){
                var chatrooms = new Chatroom({
                    chatroomName: request.body.chatroomName,
                    chatroomPicture: request.body.chatroomPicture,
                    communities : request.body.communities
                });
            } else {
                var errorMessage = "";
                if (existingChatrooms.length > 0 && (existingCommunities.length < request.body.communities.length > 0)){
                    errorMessage = "Duplicate Chatroom and Communities List Invalid"
                } else if (existingChatrooms.length > 0){
                    errorMessage = "Duplicate Chatroom"
                } else {
                    errorMessage = "Communities List Invalid"
                }
                console.log(errorMessage);
                response.json({success: false, error: errorMessage});
                return;
            }
		}
		catch (err) {
			console.log(err);
		}

		chatrooms.save((err) => {
			if (err) {
				response.send(err);
			} else {
				response.json({ success: true, chatrooms: chatrooms });
			}
		});
    },

    addCommunityChatroom: async (request, response) => {
        var communities = [];

        var chatroomParam = await Chatroom.findById(request.params.chatroom_id);

        if(chatroomParam.communities){
            communities = chatroomParam.communities;
            communities.push(request.body.community_id);

        }else{
            communities.push(request.body.community_id);

        }

        Chatroom.findOneAndUpdate({_id:request.params.chatroom_id}, {communities:communities}, (err, res) => {
            if (err) {
                response.send({success: false, message: err });
            }

            if (res) {
                response.json({ success: true, message: `successfully updated chatroom (${request.body.community_id}) added for chatroom (${request.params.chatroom_id})` });					
            }
        });

    },

    deleteChatrooms: async (request, response) => {

		Chatroom.findByIdAndDelete( request.params.chatroom_id , (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, message: `chatroom deleted successfully (${res._id})` });
			}
			
		});
    },
    
    searchChatrooms: async (request, response) => {
        var parameters = request.query;

        Chatroom.find(parameters,(err, result) => {
            if (err)
                response.send(err);
            
            if (result)
                response.send(result);
        })
    },
    
    getChatroom: async (request, response) => {
        Chatroom.findById(request.params.chatroom_id, (err, res) => {
                if (err)
                    response.send(err);
                
                if (res)
                    response.send(res);
            });
        }
};

module.exports = chatroomsController;