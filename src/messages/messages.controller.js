var mongoose   = require('mongoose');
var messagesSchema = require('./messages.model');
const Message = mongoose.model('message', messagesSchema, 'messages');

const messagesController = {
    addMessage: async (request, response) => {

		try {
			var message = new Message({
				userID: request.body.userID,
				chatroomID: request.body.chatroomID,
                message: request.body.message,
				dateSent: new Date()
			});

		}
		catch (err) {
			console.log(err);
		}

		message.save((err) => {
			if (err) {
				response.send(err);
			} else {
				response.json({ success: true, message: message });
			}
		});
	},

	deleteMessage: async (request, response) => {

		Message.findByIdAndDelete( request.params.message_id , (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, message: `successfully deleted message (${res._id})` });
			}
			
		});
	},
	updateMessage: async (request, response) => {
		
		Message.findByIdAndUpdate(request.params.message_id, request.body, (err, res) => {
					if (err) {
						response.send(err);
					}
		
					if (res) {
						response.json({ success: true, message: `successfully updated message (${res._id})` });
					}
				});
		
			},

	searchMessage: async (request, response) => {
				var parameters = request.query;
		
				Message.find(parameters,null, {sort: {dateSent: 1}},(err, result) => {
					if (err)
						response.send(err);
					
					if (result)
						response.send(result);
				})
			},

			   
		getMessage: async (request, response) => {
			Message.findById(request.params.message_id, (err, res) => {
					if (err)
						response.send(err);
					
					if (res)
						response.send(res);
				});
			}

};

module.exports = messagesController;