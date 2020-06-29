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

			message.save((err) => {
				if (err) {
					response.json({success: false, message: err.message});
					return;
				} else {
					response.json({ success: true, message: message });
					return;
				}
			});
		}
		catch (err) {
			response.json({success: false, message: err.message});
			return;
		}
	},

	deleteMessage: async (request, response) => {

		Message.findByIdAndDelete( request.params.message_id , (err, res) => {
			if (err) {
				response.json({success: false, message: err.message});
				return;
			}

			if (res) {
				response.json({ success: true });
			}
			
		});
	},
	updateMessage: async (request, response) => {
		
		Message.findByIdAndUpdate(request.params.message_id, request.body, (err, res) => {
			if (err) {
				response.json({success: false, message: err.message});
				return;
			}

			if (res) {
				response.json({ success: true });
			}
		});
	
	},

	searchMessage: async (request, response) => {
		var parameters = request.query;

		Message.find(parameters, null, {sort: {dateSent: 1} }, (err, result) => {
			if (err) {
				response.json({ success: false, message: err.message });
				return;
			}
			
			if (result)
				response.json({ success: true, messages: result })
		})
	},

			   
	getMessage: async (request, response) => {
		Message.findById(request.params.message_id, (err, res) => {
			if (err) {
				response.json({success: false, message: err.message});
				return;
			}
			
			if (res)
				response.send({ success: true, message: res });
		});
	}

};

module.exports = messagesController;