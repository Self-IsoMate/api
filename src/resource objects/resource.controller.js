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
			- links (array of links)

		*/

		var category;

		if (request.body.categoryId) {
			category = await Category.findById(request.body.categoryId, (err) => {
				if (err) {
					response.json({ success: false, message: err.message });
					return;
				}
			});

			if (!category) {
				response.status(404);
				response.json({ success: false, message: "No category found" });
				return;
			}
		}

		var resource = new Resource({
			title: request.body.title,
			body: request.body.body,
			image: request.body.image,
			categoryId: request.body.categoryId,
			links: request.body.links
		});

		resource.save((err, res) => {
			if (err) {
				response.json({ success: false, message: err.message });
				return;
			}

			if (res) {
				if (request.body.categoryId) {
					category.resources.push(res._id);

					Category.findByIdAndUpdate(category._id, category, (catErr, catRes) => {
						if (catErr) {
							response.json({ success: false, message: catErr });
							return;
						}


						if (catRes) {
							response.json({ success: true, resource: res });
							return;
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
	updateResource: async (request, response) => {

        Resource.findByIdAndUpdate(request.params.resource_id, request.body, {new: true}, (err, res) => {
            if (err) {
				response.json({success: false, message: err.message});
				return;
            }

            if (res) {
                response.json({ success: true, resource: res });
            }
        });
    },

	// search resources
	getResources: async (request, response) => {
		Resource.find(request.query, (err, res) => {
			if (err) {
				response.json({ success: false, message: err.message });
				return;
			}

			if (res) {
				response.json({ success: true, resources: res });
			}
		})
	},

	addHyperlinkToResource: async (request, response) => {
		/**
		 * get the resource id from request.params.resource_id
		 * get the link from the body (request.body.hyperlink)
		 */

		var resource = await Resource.findById(request.params.resource_id, (err) => {
			if (err) {
				response.json({ success: false, message: err});
				return;
			}
		});

		if (!resource) {
			response.status(404);
			response.json({ success: false, message: "Resource not found" });
			return;
		}

		resource.links.push(request.body.hyperlink);

		Resource.findByIdAndUpdate(resource._id, resource, (err, res) => {
			if (err) {
				response.json({ success: false, message: err.message });
				return;
			}

			if (res) {
				response.json({ success: true, resource: resource});
			}
		});
	}


	// add multiple existing resources to category
}

module.exports = resourcesController;