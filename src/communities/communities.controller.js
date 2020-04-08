var mongoose   = require('mongoose');
var cors = require('cors');
var communitySchema = require('./communities.model');
var categorySchema = require('../categories/categories.model');

var categoryController = require('../categories/categories.controller');

const Community = mongoose.model('community', communitySchema, 'communities'); //export the model
const Category = mongoose.model('category', categorySchema, 'categories');

const CommunityController = {
	addCommunity: async (request, response) => {

		var category = await Category.findById(request.body.categoryId, (err) => {
			if (err)
				response.send(err);
		});

		try {
			var community = new Community({
				name: request.body.name,
				image: request.body.image
			});
			
			community.save((err, result) => {
				if (err) response.json({ success: false, message: err });

				if (result) response.json({ success: true, community: result });
			})
		}
		catch (err) {
			response.send(err);
		}
	},

	deleteCommunity: async (request, response) => {

		// check if there are any relationships between categories and this community

		try {

			Community.deleteOne({ _id: request.params.community_id }, (err, res) => {
				if (err) {
					response.json({ success: false, message: err });
				}

				if (res) {
					response.json({ success: true, message: `successfully deleted community (${request.params.community_id})` });
				}
				
			});

		} catch (err) {
			response.json({ success: false, message: err });
		}
	},

	updateCommunity: async (request, response) => {

		// find any relationships between this and categories

		// update that

		// and update this

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
	},

	getCommunities: async (request, response) => {
		var parameters = request.query;

		Community.find(parameters, (err, res) => {
			if (err)
				response.send(err);
			
			if (res)
				response.send(res);
		});
	},

	getCommunitiesFromCategory: async (request, response) => {
		var parameter = request.params.category_name;

		Category.findOne({ name: category_name }, 'communities', (err, res) => {
			if (err) response.json({ success: false, message: err });

			if (res) response.json({ success: true, communities: res });
		});
	}
};

module.exports = CommunityController;