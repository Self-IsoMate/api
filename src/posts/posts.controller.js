var mongoose   = require('mongoose');
var postsSchema = require('./posts.model');
var communitySchema = require('../communities/communities.model');
var userSchema = require('../users/users.model');
const Post = mongoose.model('post', postsSchema, 'posts');
const User = mongoose.model('user', userSchema, 'user_registration'); //export the model
const Community = mongoose.model('community', communitySchema, 'communities'); //export the model
const {Storage} = require('@google-cloud/storage');


const postsController = {

        addPost: async (request, response) => {

            var user = await User.findById(request.body.userId)

            if (!user) {
                response.status(404);
                response.json({ success: false, message: "User doesn't exist" });
                return;
            }

            var existingCommunities = await Community.find({ '_id': { $in: request.body.communities } })

            Promise.all([user, existingCommunities]).then((success) => {
                if (success) {

                    var [user, existingCommunities] = success;

                    if (existingCommunities.length != request.body.communities.length) {
                        response.json({ success: false, message: 'Could not add communities' });
                        return;
                    } else {
                        var post = new Post({
                            media: request.body.media,
                            title: request.body.title,
                            body: request.body.body,
                            userId: user._id,
                            communities: request.body.communities,
                            datePosted: Date.now()
                        });
                
                        post.save((err, post) => {
                            if (err) {
                                response.json({success: false, message: err.message});
                            } else {
                                response.json({ success: true, post: post });
                            }
                        });
                    }
                }
            })
            .catch((err) => {
                if (err) {
                    response.json({ success: false, message: err.message });
                    return;
                }
            });
        },

        deletePost: async (request, response) => {

            Post.findByIdAndDelete( request.params.post_id , (err, res) => {
                if (err) {
                    response.json({success: false, message: err.message});
                    return;
                }

                if (res) {
                    response.json({ success: true });
                }
                
            });
        },

         updatePost: async (request, response) => {
            request.body.dateEdited = new Date();

            Post.findByIdAndUpdate(request.params.post_id, request.body, {new: true}, (err, res) => {
                if (err) {
                    response.json({success: false, message: err.message});
                    return;
                }
    
                if (res) {
                    response.json({ success: true, post: res });
                }
            });
        },

        searchPosts: async (request, response) => {//can use User Id to search posts from userid same for community use api/posts/ and ?userId=5e8767439fb439421c01696e
            var parameters = request.query;
    
            Post.find(parameters,(err, result) => {
                if (err) {
                    response.json({ success: false, message: err.message });
                    return;
                }
                
                if (result)
                    response.json({ success: true, posts: result });
            })
        },

        getPost: async (request, response) => {
            Post.findById(request.params.post_id, (err, res) => {
                if (err) {
                    response.json({success: false, message: err.message});
                    return;
                }
                
                if (res)
                    response.send({ success: true, post: res });
            });
        },

        delMediaPost: async (request, response) => {
            const bucketName = request.body.bucketName; // self-isomate-images
            const filename = request.body.filename // post-images/IMG_20200602_140814.jpg

            // Imports the Google Cloud client library

            // Creates a client
            const storage = new Storage();

            async function deleteFile() {
                // Deletes the file from the bucket
                await storage.bucket(bucketName).file(filename).delete();
                response.json({ success: true });
            }

            deleteFile()
                .catch((err) => {
                    if (err) {
                        response.json({ success: false, message: err.message })
                        return;
                    }
                });          
        }
    };

module.exports = postsController;