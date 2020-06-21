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
			response.json({success: false, message: err.message});
		}

		token.save((err) => {
			if (err) {
				response.json({success: false, message: err.message});
			} else {
				response.json({ success: true, token: token });
			}
		});
	},
	
	deleteToken: async (request, response) => {

/*

		/api/tokens

{
    "email":"sophie.norman2@btinternet.com"
}

*/

		try {

			Token.deleteMany({ email:request.params.email }, (err, res) => {
				if (err) {
					response.send({success: false, message: err });
				}

				if (res) {
					response.json({ success: true, message: `successfully deleted token (${request.params.email})` });
				}

			});

		} catch (err) {
			response.json({ success: false, message: err });
		}
	}

};
    module.exports = tokensController;