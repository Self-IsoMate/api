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

		User.deleteOne({ _id: request.params.category_id }, (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, message: `successfully deleted category (${request.params.user_id})` });
			}
			
		});
	},

	updateUser: async (request, response) => {

		User.findByIdAndUpdate(request.params.category_id, request.body, (err, res) => {
			if (err) {
				response.send(err);
			}

			if (res) {
				response.json({ success: true, update: res });
			}
		});

	}
};

module.exports = categoriesController;