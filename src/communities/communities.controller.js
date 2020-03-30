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

		// check if there are any relationships between categories and this community

		try {

		var categoryCommunities = await CategoryCommunity.find({ 'category._id': { $elemMatch: { _id: request.params.community_id } } }, (err) => {
			if (err)
				throw err;
		});

		if (categoryCommunities) {

			console.log("here");

			// remove from list of communities
			CategoryCommunity.updateMany( 
				{ _id: request.params.community_id },
				{ $pull: { "communities" : { _id : request.params.community_id } } },
				{ safe: true },
				(err, obj) => {
					if (err)
						throw err;

					if (obj)
						console.log(obj);
				});
			
		}

		Community.deleteOne({ _id: request.params.community_id }, (err, res) => {
			if (err) {
				throw err;
			}

			if (res) {
				response.json({ success: true, message: `successfully deleted community (${request.params.community_id})` });
			}
			
		});

		} catch (err) {
			response.send(err);
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

		CategoryCommunity.find({ 'category.name': parameter }, (err, res) => {
			if (err)
				response.send(err);

			if (res)
				response.send(res);
		});
	}
};

module.exports = CommunityController;