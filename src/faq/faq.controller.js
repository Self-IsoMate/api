var mongoose   = require('mongoose');
var faqSchema = require('../faq/faq.model');

const FAQ = mongoose.model('faq', faqSchema, 'faq'); //export the model

const faqController = {
    addQuestion: async (request, response) => {
        try {
            var existingQuestion = await FAQ.find({ question: request.body.question }, (err) => {
                if (err) {
                    console.log(err)
                }
            })
            if (existingQuestion.length == 0) {
                var newFAQ = new FAQ({
                    question: request.body.question,
                    answer: request.body.answer,
                });
            } else {
                errorMessage = "Question already in system"
                console.log(errorMessage);
                response.json({ success: false, error: errorMessage });
                return;
            }
        }
        catch (err) {
            console.log(err);
        }

        newFAQ.save((err) => {
            if (err) {
                response.send(err);
            } else {
                response.json({ success: true, newFAQ: newFAQ });
            }
        });
    },

    updateQuestion: async (request, response) => {
        FAQ.findByIdAndUpdate(request.params._id, request.body, (err, res) => {
            if (err) {
                response.send(err);
            }

            if (res) {
                response.json({ success: true, message: `successfully updated question (${res._id})` });
            }
        });
    },
    
    getFAQ: async (req, res) => {
		var parameters = req.query;
		FAQ.find(parameters, (error, response) => {
			if (error) {
				res.send({success: false, message: err });
			}
			if (response) {
				res.json({ success: true, questions: response });
			}
		});
    },
    
    deleteQuestion: async (request, response) => {
        FAQ.findByIdAndDelete(request.params._id, (err, res) => {
            if (err) {
                response.send(err);
            }

            if (res) {
                response.json({ success: true, message: `question deleted successfully (${res._id})` });
            }

        });
    }
};

module.exports = faqController;