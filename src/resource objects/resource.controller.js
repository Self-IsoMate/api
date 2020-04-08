var mongoose   = require('mongoose');

const resourceSchema = require ('./resource.model');
const categorySchema = require ('../categories/categories.model');

const Resource = mongoose.model('resource', resourceSchema, 'resources');
const Category = mongoose.model('category', categorySchema, 'categories');

const resourcesController = {
	// add resource
	addResource: async (request, response) => {
		/*
			Request body:
			- title (required)
			- body (required)
			- image (optional)
			- category id (optional)

		*/

		var category;

		if (request.body.categoryId) {
			category = await Category.findById(request.body.categoryId, (err) => {
				if (err) {
					response.json({ success: false, message: err });
				}
			});

			if (!category) {
				response.json({ success: false, message: "No category found" });
			}
		}

		var resource = new Resource({
			title: request.body.title,
			body: request.body.body,
			image: request.body.image,
			categoryId: request.body.categoryId
		});

		resource.save((err, res) => {
			if (err) {
				response.json({ success: false, message: err });
			}

			if (res) {
				if (request.body.categoryId) {
					category.resources.push(res._id);

					Category.findByIdAndUpdate(category._id, category, (catErr, catRes) => {
						if (catErr) {
							response.json({ success: false, message: catErr });
						}


						if (catRes) {
							response.json({ success: true, resource: res });
						}
					})
				} else {

					response.json({ success: true, resource: res });

				}
			}
		});
	},

	// delete resource

	// edit resource

	// search resources
	getResources: async (request, response) => {
		Resource.find(request.query, (err, res) => {
			if (err) {
				response.json({ success: false, message: err });
			}

			if (res) {
				response.json({ success: true, resources: res });
			}
		})
	}

	// add multiple existing resources to category
}

module.exports = resourcesController;