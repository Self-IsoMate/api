var mongoose   = require('mongoose');
var chatroomsSchema = require('./chatrooms.model');
const Chatroom = mongoose.model('chatroom', chatroomsSchema, 'chatrooms');

const chatroomsController = {
    addChatrooms: async (request, response) => {

		try {
            var communities = [];
			var chatrooms = new Chatroom({
				chatroomName: request.body.chatroomName,
                chatroomPicture: request.body.chatroomPicture,
                communities : communities
			});

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

    
    updateChatroom: async (request, response) => {
        Chatroom.findByIdAndUpdate(request.params.chatroom_id, request.body, (err, res) => {
            if (err) {
                response.send(err);
            }

            if (res) {
                response.json({ success: true, message: `successfully updated chatroom (${res._id})` });
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
                response.json({ success: true, message: `successfully community (${request.body.community_id}) added for chatroom (${request.params.chatroom_id})` });					
            }
        });

    },

    deleteChatrooms: async (request, response) => {

		Chatroom.findByIdAndDelete( request.params.chatroom_id , (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, message: `successfully chatroom deleted (${res._id})` });
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