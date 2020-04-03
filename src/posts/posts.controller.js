var mongoose   = require('mongoose');
var postsSchema = require('./posts.model');
var communitySchema = require('../communities/communities.model');
var userSchema = require('../users/users.model');
const Post = mongoose.model('post', postsSchema, 'posts');
const User = mongoose.model('user', userSchema, 'user_registration'); //export the model
const Community = mongoose.model('community', communitySchema, 'communities'); //export the model


const postsController = {
//    var array = [];

        addPost: async (request, response) => {

            var user = User.findById(request.body.user)

            var community = Community.findById(request.body.community)

            Promise.all([user, community]).then((success, failed) => {
                if (success) {

                    var [user, community] = success;

                    var post = new Post({
                        media: request.body.media,
                        title: request.body.title,
                        body: request.body.body,
                        user: user,
                        community: community ,
                        datePosted: Date.now()
                    });
            
                    post.save((err, post) => {
                        if (err) {
                            console.log("error saving post");
                            response.send(err);
                        } else {
                            response.json({ success: true, post: post });
                        }
                    });
                }
            })
            .catch((err) => {
                if (err) {
                    response.json({ success: false, message: err });
                }
            });
        },

        deletePost: async (request, response) => {

                Post.findByIdAndDelete( request.params.post_id , (err, res) => {
                    console.log(err)
                    if (err) {
                        response.send(err);
                    }

                    if (res) {
                        response.json({ success: true, message: `successfully deleted post (${res._id})` });
                    }
                    
                });
            },
         updatePost: async (request, response) => {
                Post.findByIdAndUpdate(request.params.post_id, request.body, (err, res) => {
                    if (err) {
                        response.send(err);
                    }

                    if (res) {
                        Post.findByIdAndUpdate(request.params.post_id, {dateEdited : Date.now()}, (err, res) => {//it adds at what time it has been modified
                            if (err) {
                                response.send(err);
                            }
        
                            if (res) {
                                response.json({ success: true, message: `successfully updated post (${res._id})` });
                            }
                        });                    }
                });

            },
        searchPosts: async (request, response) => {//can use User Id to search posts from userid same for community use api/posts/ and JSON{"_id": ""}
                var parameters = request.query;
        
                Post.find(parameters,(err, result) => {
                    if (err)
                        response.send(err);
                    
                    if (result)
                        response.send(result);
                })
            },
        getPost: async (request, response) => {
                Post.findById(request.params.post_id, (err, res) => {
                    if (err)
                        response.send(err);
                    
                    if (res)
                        response.send(res);
                });
            }
    

};

module.exports = postsController;