// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose   = require('mongoose');

const path = require ('path');

var userController = require('./src/users/users.controller')
var categoryController = require('./src/categories/categories.controller');
var communityController = require('./src/communities/communities.controller');
var challengesController = require('./src/challenges/challenges.controller');
var postsController = require('./src/posts/posts.controller')

// SCHEMAS


const CONNECTION_STRING = 'mongodb+srv://sophie:applesAndOranges@self-isomatedb-8bnuw.gcp.mongodb.net/test?retryWrites=true&w=majority';

// FUNCTIONS FOR API

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true, useFindAndModify: false });

app.use(express.static('www'));
app.set('port', process.env.PORT || 8080);
app.use(cors());


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// more routes for our API will happen here

// User routes

router.route('/users')
	.post(userController.addUser)
	.get(userController.findUser)
;

router.route('/users/:user_id')
    .delete(userController.deleteUser)
	.put(userController.updateUser)
;

router.route('/verify/')
	.post(userController.sendVerification)
;

router.route('/verify/:email/:token')
    .post(userController.verifyUser)
;

// Categories routes

router.route('/categories')
	.post(categoryController.addCategory)
	.get(categoryController.searchCategories)
;

router.route('/categories/:category_id')
	.delete(categoryController.deleteCategory)
	.put(categoryController.updateCategory)
	.get(categoryController.getCategory)
;

// community routes

router.route('/communities')
	.post(communityController.addCommunity)
	.get(communityController.getCommunities)
;

router.route('/communities/:community_id')
	.get(communityController.getCommunity)
	.delete(communityController.deleteCommunity)
	.put(communityController.updateCommunity)
;
// challenges routes
router.route('/challenges')
	.post(challengesController.addChallenge)
	.get(challengesController.searchChallenges)
;

router.route('/challenges/:challenge_id')
	.delete(challengesController.deleteChallenge)
	.put(challengesController.updateChallenge)
	.get(challengesController.getChallenge)
;
// posts routes
router.route('/posts')
	.post(postsController.addPost)
	.get(postsController.searchPosts)
;

router.route('/posts/:post_id')
	.delete(postsController.deletePost)
	.put(postsController.updatePost)
	.get(postsController.getPost)
;


router.route('/categories/:category_name/communities')
	.get(communityController.getCommunitiesFromCategory);

router.route('/users/:user_id/communities')
	.post(userController.addCommunity)
	.delete(userController.removeCommunity)
	.get(userController.getCommunitiesFromUser)
;

router.route('/login')
	.post(userController.requestLogin)
;

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

