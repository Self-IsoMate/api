var mongoose   = require('mongoose');
var categorySchema = require('./categories.model');
const Category = mongoose.model('category', categorySchema, 'categories');

const categoriesController = {
	addCategory: async (request, response) => {

		try {
			var category = new Category({
				name: request.body.name,
				image: request.body.image,
				isSubcategory: false
			});

		}
		catch (err) {
			console.log(err);
		}

		category.save((err) => {
			if (err) {
				response.send(err);
			} else {
				response.json({ success: true, category: category });
			}
		});
	},

	deleteCategory: async (request, response) => {

		Category.findByIdAndDelete( request.params.category_id , (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, message: `successfully deleted category (${res._id})` });
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
		
		var parentCategory = await Category.findById(request.params.category_id)

		var subcategory = await Category.findById(request.body.subcategoryId)

		Promise.all([parentCategory, subcategory])
			.then((res) => {
				if (res) {
					var [ parent, subcat ] = res;

					subcat.isSubcategory = true;

					Category.findByIdAndUpdate(subcat._id, subcat, (err) => {
						if (err) response.send(err)
					});

					parent.subcategories.push(subcat);

					Category.findByIdAndUpdate(parent._id, parent, (err, result) => {
						if (err) response.json({ success: false, message: err });

						else if (result) response.json({ success: true, category: parent });

						else console.log("nothing");
					});
				}
			})
			.catch((err) => response.json({ success: false, message: err }));

		// if there are already subcategories, then add to that list

		// otherwise, create a new list and add the subcategory

	},

	removeSubcategory: async (request, response) => {
		var parentCategory = await Category.findById(request.params.category_id)

		var subcategory = await Category.findById(request.params.subcategory_id)

		Promise.all([parentCategory, subcategory])
			.then((res) => {
				if (res) {
					var [ parent, subcat ] = res;
					parent.subcategories = parent.subcategories.filter((s) => {
						s._id != subcat._id
					});


					Category.findByIdAndUpdate(parent._id, parent, (err, result) => {
						if (err) response.json({ success: false, message: err });

						if (result) response.json({ success: true, category: parent });
					});
				}
			})
			.catch((err) => response.json({ success: false, message: err }));
	}
};

module.exports = categoriesController;