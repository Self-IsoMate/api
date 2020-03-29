var mongoose   = require('mongoose');
var cors = require('cors');
var communitySchema = require('./communities.model');
const Community = mongoose.model('community', communitySchema, 'communities'); //export the model

const CommunityController = {
	addCommunity: async (request, response) => {

		try {
			var community = new Community({
				name: request.body.name,
				image: request.body.image,
				categoryId: request.body.categoryId,
				dateCreated: new Date()
			});

		}
		catch (err) {
			console.log(err);
		}

		community.save((err) => {
			if (err) {
				response.send(err);
			} else {
				response.json({ success: true, community: community });
			}
		});
	},

	deleteCommunity: async (request, response) => {

		Community.deleteOne({ _id: request.params.community_id }, (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, message: `successfully deleted community (${request.params.community_id})` });
			}
			
		});
	},

	updateCommunity: async (request, response) => {

		Community.findByIdAndUpdate(request.params.community_id, request.body, (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, update: res });
			}
		});

	},

	getCommunity: async (request, response) => {
		Community.findById(request.params.community_id, (err, res) => {
			if (err)
				response.send(err);
			
			if (res)
				response.json({ success: true, community: res });
		})
	}
};

module.exports = CommunityController;