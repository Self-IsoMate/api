var mongoose   = require('mongoose');

var categorySchema = require('./categories.model');
var communitySchema = require('../communities/communities.model');

const Community = mongoose.model('community', communitySchema, 'communities');
const Category = mongoose.model('category', categorySchema, 'categories');

const categoriesController = {
	addCategory: async (request, response) => {

		var parent;

		if (request.body.parentId) {
			parent = await Category.findById(request.body.parentId, (err) => {
				if (err) {
					response.json({ success: false, message: err.message });
					return;
				}
			});

			parent.isLeaf = false;
		}

		try {
			var category = new Category({
				name: request.body.name,
				image: request.body.image,
				isChild: parent ? true : false,
				isLeaf: true,
				communities: request.body.communities,
			});

			if (parent) {
				category.parentId = parent._id;
			}

		}
		catch (err) {
			response.json({success: false, message: err.message});
		}

		category.save((err, res) => {
			if (err) {
				response.json({ success: false, message: err});
				return;
			} else {
				// update parent here

				if (res && parent) {
					parent.children.push(res._id)
					Category.findByIdAndUpdate(parent._id, parent, (parentErr, parentRes) => {
						if (parentErr) { 
							response.json({success: false, message: parentErr.message });
						}

						if (parentRes) {
							response.json({ success: true, category: category });
						}
					});
				} else {
					if (res) {
						response.json({ success: true, category: res });
					}
				}

			}
		});
	},

	deleteCategory: async (request, response) => {

		// find category
		// if it has children, throw an error
		// if it has a parent, delete it from its children
		// if the above is successful, then delete the category

		var parent;

		var category = await Category.findById( request.params.category_id, (err) => {
			response.json({ success: false, message: err.message });
			return;
		})

		if (category.children.length > 0) {
			response.status(404);
			response.json({ success: false, message: "Category contains children - please delete these first" });
			return;
		}

		if (category.parent) {
			parent = Category.findById(category.parent, (err) => {
				response.json({ success: false, message: err.message })
				return;
			})

			parent.children = parent.children.filter((c) => c != category._id);
		}
		
		Category.findByIdAndDelete( request.params.category_id , (err, res) => {
			if (err) {
				response.json({success: false, message: err.message});
			}

			if (res) {
				if (parent) {
					Category.findByIdAndUpdate(parent._id, parent, (parentErr, parentRes) => {
						if (parentErr) {
							response.json({ success: false, message: parentErr });
							return;
						}

						if (parentRes) {
							response.json({ success: true });
							return;
						}
					});
				} else {
					response.json({ success: true });
				}

			}
			
		});
	},

	updateCategory: async (request, response) => {

		Category.findByIdAndUpdate(request.params.category_id, request.body, (err, res) => {
			if (err) {
				response.json({success: false, message: err.message});
			}

			if (res) {
				response.json({ success: true });
			}
		});

	},

	getCategories: async (request, response) => {
		Category.find((err, result) => {
			if (err) {
				response.json({ success: false, message: err.message });
				return;
			}
			
			if (result)
				response.json({ success: true, categories: result });
		})
	},

	getCategory: async (request, response) => {
		Category.findById(request.params.category_id, (err, res) => {
			if (err)
				response.json({success: false, message: err.message});
			
			if (res)
				response.json({ success: true, category: result });
		});
	},

	searchCategories: async (request, response) => {
		var parameters = request.query;

		Category.find(parameters, (err, res) => {
			if (err)
				response.json({success: false, message: err.message});
			
			if (res)
				response.json({ success: true, categories: res });
		});
	},

	addSubcategory: async (request, response) => {
		
		// use id to get category
		// use parent id to get parent

		// add category id to children id in parent
		// add parent id as parent id in category

		var child = await Category.findById(request.body.child, (err) => {
			if (err) {
				response.json({success: false, message: err.message});
			}
		})

		var parent = await Category.findById(request.body.parent, (err) => {
			if (err) {
				response.json({success: false, message: err.message});
			}
		})

		child.parent = parent._id;
		parent.children.push(child._id);

		// creating an array of promises to be used by Promise.all
		var promises = [ child, parent ].map((item) => {
			return Category.findByIdAndUpdate(item._id, item);
		})

		Promise.all(promises)
			.then((documents) => {
				var [ childRes, parentRes ] = documents;

				if (childRes && parentRes) {
					response.json({ success: true, parent: parent, child: child });
				}
			})
			.catch((err) => {
				if (err) {
					response.json({success: false, message: err.message});
				}
			})

	},

	addCommunitiesToCategory: async (request, response) => {
		// category id in params
		// community ids in body

		var communities = request.body.communities;

		// checking the community ids exist

		var communityCount = await Community.find({ '_id': { $in: communities } }, (err) => {
			if (err) {
				response.json({ success: false, message: err.message });
				return;
			}
		});

		if (communityCount.length != communities.length) {
			response.status(400);
			response.json({ success: false, message: "Number of communities found does not match entered" });
			return;
		}

		var category = await Category.findById(request.params.category_id, (err) => {
			if (err) {
				response.json({ success: false, message: err.message });
				return;
			}
		});

		if (!category) {
			response.json({ success: false, message: "No category found" });
			return;
		}

		category.communities.concat(communities);

		Category.findByIdAndUpdate(category._id, category, (err, res) => {
			if (err) {
				response.json({ success: false, message: err.message });
				return;
			}

			if (res) {
				response.json({ success: true, category: category });
				return;
			}
		});
	}
};

module.exports = categoriesController;