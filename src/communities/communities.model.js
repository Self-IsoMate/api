const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *  schemas:
 *      Community:
 *          type: object
 *          required:
 *              - name
 *              - _id
 *          properties:
 *              name:
 *                  type: string
 *                  description: Name of the Community.
 *              image:
 *                  type: string
 *                  description: Image associated with the Community.
 *              _id:
 *                  type: string
 *                  description: ID of Community
 *          example:
 *              name: Sewing for Embroidery 101
 *              image: www.images.fake/images/fun.jpg
 *              _id: 021398472318
 */
const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  image: {
    type: String
  }
});

module.exports = communitySchema;
