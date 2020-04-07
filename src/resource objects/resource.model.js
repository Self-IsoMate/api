const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	title: {
		type: String,
		required: [ true, 'Resource must have a title' ]
	},
	body: {
		type: String,
		required: [ true, 'Resource must have a body' ]
	},
	image: {
		type: String
	},
	categoryId: {
		type: String,
		required: [ true, 'Resource must be associated with a category' ]
	}
});

module.exports = schema;