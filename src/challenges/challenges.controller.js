var mongoose   = require('mongoose');
var challengeSchema = require('./challenges.model');
var communitySchema = require('../communities/communities.model');
const Community = mongoose.model('community', communitySchema, 'communities'); //export the model
const Challenge = mongoose.model('challenge', challengeSchema, 'challenges');

const challengesController = {
    addChallenge: async (request, response) => {

		try {
			var challenge = new Challenge({
				title: request.body.title,
				image: request.body.image,
                description: request.body.description,
                community: await Community.findById(request.body.community)
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
    
    getChallenges: async (request, response) => {
		Challenge.find((err, result) => {
			if (err)
				response.send(err);
			
			if (result)
				response.send(result);
		})
	}

};

module.exports = challengesController;