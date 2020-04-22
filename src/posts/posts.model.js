const mongoose = require('mongoose')

/**
 * @swagger
 * components:
 *  schemas:
 *    Post:
 *      type: object
 *      required:
 *        - title
 *        - body
 *        - userId
 *        - communities
 *      properties:
 *        media:
 *          type: string
 *          description: URL to media of post
 *        title:
 *          type: string
 *          description: title of post
 *        body:
 *          type: string
 *          description: body of post
 *        userId:
 *          type: string
 *          description: ID of the user that made the post
 *        communities:
 *          type: array
 *          items:
 *            type: string
 *          description: Array of IDs of communities to post this post to
 *        datePosted:
 *          type: date
 *          description: Date post was posted
 *      example:
 *        title: I love to sew
 *        body: Today, I embroidered a cat onto my duvet
 *        userId: 23l4bjk324kjb
 *        communities: [ "123", "456" ]
 */

const postsSchema = new mongoose.Schema({
  media: {
    type: String
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  body: {
    type: String,
    required: [true, 'Body is required']
  },
  userId: {
    type: String, // changed to refer to user id in case user details change
    required: [true, 'User is required']
  },
  communities: {
    type: [String], // this should be an array of community ids
    required: [true, 'Community is required']  
  },
  datePosted: {
    type: Date,
  },
  dateEdited: {
    type: Date
  }
})

module.exports = postsSchema
