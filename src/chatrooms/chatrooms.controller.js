var mongoose = require('mongoose');
var chatroomsSchema = require('./chatrooms.model');
var communitySchema = require('../communities/communities.model');
const Chatroom = mongoose.model('chatroom', chatroomsSchema, 'chatrooms');
const Community = mongoose.model('community', communitySchema, 'communities');

const mailer = require("nodemailer");
require('dotenv').config();
var fs = require('fs');

const transporter = mailer.createTransport({
    service: "Outlook365",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const chatroomsController = {
    addChatrooms: async (request, response) => {

        try {
            var existingChatrooms = await Chatroom.find({ chatroomName: request.body.chatroomName }, (err) => {
                if (err) {
                    response.json({success: false, message: err.message});
                }
            })
            var existingCommunities = await Community.find({ '_id': { $in: request.body.communities } }, (err) => {
                if (err) {
                    response.json({success: false, message: err.message});
                }
            })
            if (existingChatrooms.length == 0 && (existingCommunities.length == request.body.communities.length)) {
                var chatrooms = new Chatroom({
                    chatroomName: request.body.chatroomName,
                    chatroomPicture: request.body.chatroomPicture,
                    communities: request.body.communities
                });
            } else {
                var errorMessage = "";
                if (existingChatrooms.length > 0 && (existingCommunities.length < request.body.communities.length > 0)) {
                    errorMessage = "Duplicate Chatroom and Communities List Invalid"
                } else if (existingChatrooms.length > 0) {
                    errorMessage = "Duplicate Chatroom"
                } else {
                    errorMessage = "Communities List Invalid"
                }
                response.json({ success: false, error: errorMessage });
                return;
            }
        }
        catch (err) {
            response.json({success: false, message: err.message});
        }

        chatrooms.save((err) => {
            if (err) {
                response.json({success: false, message: err.message});
            } else {
                response.json({ success: true, chatrooms: chatrooms });
            }
        });
    },

    updateChatroom: async (request, response) => {
        Chatroom.findByIdAndUpdate(request.params.chatroom_id, request.body, (err, res) => {
            if (err) {
                response.json({success: false, message: err.message});
            }

            if (res) {
                response.json({ success: true, message: `successfully updated chatroom (${res._id})` });
            }
        });
    },

    addCommunityChatroom: async (request, response) => {
        var communities = [];

        var chatroomParam = await Chatroom.findById(request.params.chatroom_id);

        if (chatroomParam.communities) {
            communities = chatroomParam.communities;
            communities.push(request.body.community_id);

        } else {
            communities.push(request.body.community_id);

        }

        Chatroom.findOneAndUpdate({ _id: request.params.chatroom_id }, { communities: communities }, (err, res) => {
            if (err) {
                response.json({ success: false, message: err });
                return;
            }

            if (res) {
                response.json({ success: true });
            }
        });

    },

    deleteChatrooms: async (request, response) => {

        Chatroom.findByIdAndDelete(request.params.chatroom_id, (err, res) => {
            if (err) {
                response.json({success: false, message: err.message});
            }

            if (res) {
                response.json({ success: true, message: `chatroom deleted successfully (${res._id})` });
            }

        });
    },

    searchChatrooms: async (request, response) => {
        var parameters = request.query;

        Chatroom.find(parameters, (err, result) => {
            if (err)
                response.json({success: false, message: err.message});

            if (result)
                response.json({ success: true, chatrooms: result });
        })
    },

    getChatroom: async (request, response) => {
        Chatroom.findById(request.params.chatroom_id, (err, res) => {
            if (err)
                response.json({success: false, message: err.message});

            if (res)
                response.json({ success: true, chatroom: res });
        });
    },

    requestNewChatroom: async (request, response) => {
        try {
            let body = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: `New Chatroom Request - ${request.body.chatroomName}`,
                html: 
                `<p>Chatroom Request: "${request.body.chatroomName}"</p>
                <p>From: ${request.body.user_id}</p>`
            }

            transporter.sendMail(body, (errormail, resultmail) => {
                if (errormail) {
                    response.json({success: false, message: errormail.message});
                }
            });
            response.json({ success: true });
        } catch (err) {
            response.json({ success: false, message: err.message });
            return;
        }
    }
}
module.exports = chatroomsController;