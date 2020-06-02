var mongoose   = require('mongoose');
var postsSchema = require('./posts.model');
var communitySchema = require('../communities/communities.model');
var userSchema = require('../users/users.model');
const Post = mongoose.model('post', postsSchema, 'posts');
const User = mongoose.model('user', userSchema, 'user_registration'); //export the model
const Community = mongoose.model('community', communitySchema, 'communities'); //export the model


const postsController = {

        addPost: async (request, response) => {

            var user = await User.findById(request.body.userId)

            if (!user) {
                response.json({ success: false, message: "User doesn't exist" });
                return;
            }

            var existingCommunities = await Community.find({ '_id': { $in: request.body.communities } })

            Promise.all([user, existingCommunities]).then((success) => {
                if (success) {

                    var [user, existingCommunities] = success;

                    if (existingCommunities.length != request.body.communities.length) {

                        console.log(`length existing: ${existingCommunities.length}`);
                        console.log(existingCommunities);
                        console.log(`length entered: ${request.body.communities.length}`);
                        response.json({ success: false, message: "Problem adding communities" });
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
                                console.log("error saving post");
                                response.send(err);
                            } else {
                                response.json({ success: true, post: post });
                            }
                        });
                    }
                }
            })
            .catch((err) => {
                if (err) {
                    console.log(err);
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
            request.body.dateEdited = new Date();

            Post.findByIdAndUpdate(request.params.post_id, request.body, {new: true}, (err, res) => {
                if (err) {
                    response.send(err);
                }
    
                if (res) {
                    response.json({ success: true, post: res });
                }
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
        },

        delMediaPost: async (request, response) => {
            const bucketName = request.body.bucketName; //self-isomate-images/post-images
            const filename = request.body.filename //IMG_20200602_140814.jpg

  // Imports the Google Cloud client library
  const {Storage} = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage();

  async function deleteFile() {
    // Deletes the file from the bucket
    await storage.bucket(bucketName).file(filename).delete();

    console.log(`gs://${bucketName}/${filename} deleted.`);
    response.send(`gs://${bucketName}/${filename} deleted.`);

  }

  deleteFile().catch(console.error);

          
        }
    };

module.exports = postsController;