const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *  schemas:
 *      FAQ:
 *          type: object
 *          required:
 *              - question
 *              - answer
 *              - _id
 *          properties:
 *              question:
 *                  type: string
 *                  description: The question you want to add to the FAQ.
 *              answer:
 *                  type: string
 *                  description: The answer to the question.
 *              _id:
 *                  type: string
 *                  description: ID of question
 *          example:
 *              question: How do I log out?
 *              answer: Open the sidebar, and select log out
 *              _id: 021398472318
 */
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required']
  }
});

module.exports = faqSchema;
