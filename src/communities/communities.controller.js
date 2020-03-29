var mongoose   = require('mongoose');
var cors = require('cors');
var communitySchema = require('./communities.model');
var categorySchema = require('../categories/categories.model');
var categoryCommunitySchema = require('../categories/categories-communities.model');

var categoryController = require('../categories/categories.controller');

const Community = mongoose.model('community', communitySchema, 'communities'); //export the model
const Category = mongoose.model('category', categorySchema, 'categories');
const CategoryCommunity = mongoose.model('category-community', categoryCommunitySchema, 'category-communities');

const CommunityController = {
	addCommunity: async (request, response) => {

		var category = await Category.findById(request.body.categoryId, (err) => {
			if (err)
				response.send(err);
		});
		
		try {
			var community = new Community({
				name: request.body.name,
				image: request.body.image,
				category: category,
				dateCreated: new Date()
			});

		}
		catch (err) {
			response.send(err);
		}

		var savedCommunity = await community.save((err) => {
			if (err)
				response.send(err);
		});

		try {

			var categoryCommunity = await CategoryCommunity.findOne({ category: category }, (err) => {
				if (err)
					response.send(err);
			})
			
			if (!categoryCommunity) {
				categoryCommunity = new CategoryCommunity({
					category: category,
					communities: [community],
					dateCreated: new Date()
				});

				categoryCommunity.save((err, res) => {
					if (err)
						response.send(err)

					if (res)
						response.send(res);
				})

			} else {

				categoryCommunity.communities.push(community);

				CategoryCommunity.findByIdAndUpdate(categoryCommunity._id, categoryCommunity, (err, res) => {
					if (err)
						response.send(err);
					
					if (res)
						response.send(res);
				});
			}
		} catch (err) {
			response.send(err);
		}
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
	},

	getCommunities: async (request, response) => {
		var parameters = request.query;

		Community.find(parameters, (err, res) => {
			if (err)
				response.send(err);
			
			if (res)
				response.send(res);
		});
	}
};

module.exports = CommunityController;