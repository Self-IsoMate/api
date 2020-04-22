const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *      Category:
 *          type: object
 *          required:
 *              - name
 *              - isChild
 *              - isLeaf
 *          properties:
 *              name:
 *                  type: string
 *                  description: Name of the category.
 *              image:
 *                  type: string
 *                  description: Image associated with the category.
 *              children:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: List of IDs of categories that have this community as a parent.
 *              parentId:
 *                  type: string
 *                  description: ID of the parent of this category
 *              communities:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: List of community IDs that users can subscribe to from this category
 *              isChild:
 *                  type: boolean
 *                  description: Flag to show whether this category is a child of another category.
 *              isLeaf:
 *                  type: boolean
 *                  description: Flag to show whether this category is a child and has no children (leaf of a tree)
 *              resources:
 *                  type: array
 *                  items: string
 *                  description: List of IDs of resources associated with this category.
 *          example:
 *              name: Sewing for Embroidery 101
 *              isChild: true
 *              isLeaf: true
 *              parentId: 23lhk21l3h4k1
 *              image: www.images.fake/images/fun.jpg
 */

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required']
	},
	image: {
		type: String
	},
	children: {
		type: [String]
	},
	parentId: {
		type: String
	},
	communities: {
		type: [String]
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
		type: [String]
	}
});

module.exports = schema;
