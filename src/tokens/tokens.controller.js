var mongoose   = require('mongoose');
var tokensSchema = require('./tokens.model');
const Token = mongoose.model('token', tokensSchema, 'tokens'); //export the model

const tokensController = {
    addToken: async (request, response) => {
        var userToken = Math.floor(1000 + Math.random() * 9000);
		try {
			var token = new Token({
				email: request.body.email,
				token: userToken.toString()             
			});

		}
		catch (err) {
			console.log(err);
		}

		token.save((err) => {
			if (err) {
				response.send(err);
			} else {
				response.json({ success: true, token: token });
			}
		});
    }
};
    module.exports = tokensController;