var mongoose   = require('mongoose');
var challengeSchema = require('./challenges.model');
const Challenge = mongoose.model('challenge', challengeSchema, 'challenges');

const challengesController = {
    addChallenge: async (request, response) => {

		try {
			var challenge = new Challenge({
				title: request.body.title,
				image: request.body.image,
				description: request.body.description,
				deadline: request.body.deadline
			});

		}
		catch (err) {
			console.log(err);
		}

		challenge.save((err) => {
			if (err) {
				response.send(err);
			} else {
				response.json({ success: true, challenge: challenge });
			}
		});
	},

    deleteChallenge: async (request, response) => {

		Challenge.findByIdAndDelete( request.params.challenge_id , (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, message: `successfully deleted challenge (${res._id})` });
			}
			
		});
    },
    
    updateChallenge: async (request, response) => {

//		console.log(request.params.challenge_id);

		Challenge.findByIdAndUpdate(request.params.challenge_id, request.body, (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, message: `successfully updated challenge (${res._id})` });
			}
		});

    },
    
    searchChallenges: async (request, response) => {
        var parameters = request.query;

		Challenge.find(parameters,(err, result) => {
			if (err)
				response.send(err);
			
			if (result)
				response.send(result);
		})
    },
   
    getChallenge: async (request, response) => {
		Challenge.findById(request.params.challenge_id, (err, res) => {
			if (err)
				response.send(err);
			
			if (res)
				response.send(res);
		});
	}

};

module.exports = challengesController;