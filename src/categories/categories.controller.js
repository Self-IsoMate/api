var mongoose   = require('mongoose');
var categorySchema = require('./categories.model');
const Category = mongoose.model('category', categorySchema, 'categories');

const categoriesController = {
	addCategory: async (request, response) => {

		var parent;

		if (request.body.parentId) {
			parent = await Category.findById(request.body.parentId, (err) => {
				if (err) {
					response.json({ success: false, message: err });
				}
			});

			parent.isLeaf = false;
		}

		try {
			var category = new Category({
				name: request.body.name,
				image: request.body.image,
				isChild: parent ? true : false,
				isLeaf: true
			});

		}
		catch (err) {
			console.log(err);
		}

		category.save((err) => {
			if (err) {
				response.json({ success: false, message: err});
			} else {
				// update parent here

				Category.findByIdAndUpdate(parent._id, parent, (parentErr, res) => {
					if (parentErr) { 
						response.json({success: false, message: parentErr});
					}

					if (res) {
						response.json({ success: true, category: category });
					}
				});

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
			response.json({ success: false, message: err });
		})

		if (category.children.length > 0) {
			response.json({ success: false, message: "Category contains children - please delete these first" });
			return;
		}

		if (category.parent) {
			parent = Category.findById(category.parent, (err) => {
				response.json({ success: false, message: err })
			})

			parent.children = parent.children.filter((c) => c != category._id);
		}
		
		Category.findByIdAndDelete( request.params.category_id , (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				if (parent) {
					Category.findByIdAndUpdate(parent._id, parent, (parentErr, parentRes) => {
						if (parentErr) {
							response.json({ success: false, message: parentErr });
							return;
						}

						if (parentRes) {
							response.json({ success: true, message: `successfully deleted category (${res._id})` });
							return;
						}
					});
				} else {
					response.json({ success: true, message: `successfully deleted category (${res._id})` });
				}

			}
			
		});
	},

	updateCategory: async (request, response) => {

		console.log(request.params.category_id);

		Category.findByIdAndUpdate(request.params.category_id, request.body, (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, message: `successfully updated category (${res._id})` });
			}
		});

	},

	getCategories: async (request, response) => {
		Category.find((err, result) => {
			if (err)
				response.send(err);
			
			if (result)
				response.send(result);
		})
	},

	getCategory: async (request, response) => {
		Category.findById(request.params.category_id, (err, res) => {
			if (err)
				response.send(err);
			
			if (res)
				response.send(res);
		});
	},

	searchCategories: async (request, response) => {
		var parameters = request.query;

		Category.find(parameters, (err, res) => {
			if (err)
				response.send(err);
			
			if (res)
				response.send(res);
		});
	},

	addSubcategory: async (request, response) => {
		
		// use id to get category
		// use parent id to get parent

		// add category id to children id in parent
		// add parent id as parent id in category

		var child = await Category.findById(request.body.child, (err) => {
			if (err) {
				response.json({success: false, message: err});
			}
		})

		var parent = await Category.findById(request.body.parent, (err) => {
			if (err) {
				response.json({success: false, message: err});
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
				response.json({success: false, message: err});
			})

	}
};

module.exports = categoriesController;