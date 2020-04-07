const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required']
	},
	image: {
		type: String
	},
	children: {
		type: Array
	},
	parentId: {
		type: String
	},
	communities: {
		type: Array
	},
	isChild: {
		type: Boolean,
		required: [ true, 'isChild flag is required' ]
	},
	isLeaf: {
		type: Boolean,
		required: [ true, 'isLeaf is required' ]
	},
	resources: {
		type: Array
	}
});

module.exports = schema;
