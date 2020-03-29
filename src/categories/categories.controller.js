var mongoose   = require('mongoose');
var categorySchema = require('./categories.model');
const Category = mongoose.model('category', categorySchema, 'categories');

const categoriesController = {
	addCategory: async (request, response) => {

		try {
			var category = new Category({
				name: request.body.name,
				image: request.body.image,
				parentCategoryId: request.body.parentCategoryId
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
	}
};

module.exports = categoriesController;