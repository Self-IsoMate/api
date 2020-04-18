// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose   = require('mongoose');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const path = require ('path');

var userController = require('./src/users/users.controller')
var categoryController = require('./src/categories/categories.controller');
var communityController = require('./src/communities/communities.controller');
var challengesController = require('./src/challenges/challenges.controller');
var postsController = require('./src/posts/posts.controller')
var messagesController = require('./src/messages/messages.controller')
var chatroomsController = require('./src/chatrooms/chatrooms.controller')
var resourceController = require('./src/resource objects/resource.controller');

// SCHEMAS


const CONNECTION_STRING = process.env.CONNECTION_STRING;

// FUNCTIONS FOR API

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(cors());

mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true, useFindAndModify: false });

app.use(express.static('www'));
app.set('port', process.env.PORT || 8080);
app.use(cors());


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// more routes for our API will happen here

// /users/

router.route('/users')
	.post(userController.addUser)
	.get(userController.findUser)
;

router.route('/users/:user_id')
    .delete(userController.deleteUser)
	.put(userController.updateUser)
;

router.route('/users/:user_id/communities')
	.post(userController.addCommunity)
	.get(userController.getCommunitiesFromUser)
;

router.route('/users/:user_id/chatrooms/')
	.post(userController.addChatroom)
;

router.route('/usersChat/:user_id')
	.get(userController.getChatroomsFromUser)
;

router.route('/users/:user_id/chatrooms/:chatroom_id') 
	.delete(userController.removeChatroom)

router.route('/users/:user_id/communities/:community_id')
	.delete(userController.removeCommunity)
;

// /login/

router.route('/login')
	.post(userController.requestLogin)
;


// /verify/

router.route('/verify')
	.post(userController.sendVerification)
;

router.route('/verify/:email/:token')
    .get(userController.verifyUser)
;

// sendReset and resetpassword

router.route('/sendReset')
	.post(userController.sendReset)
;

router.route('/resetpassword')
	.post(userController.resetUser)
;

// /categories/

router.route('/categories')
	.post(categoryController.addCategory)
	.get(categoryController.searchCategories)
;

router.route('/categories/:category_id')
	.delete(categoryController.deleteCategory)
	.put(categoryController.updateCategory)
	.get(categoryController.getCategory)
	.post(categoryController.addSubcategory)
;

router.route('/categories/:category_id/communities')
	.post(categoryController.addCommunitiesToCategory)
;

router.route('/categories/:category_name/communities')
	.get(communityController.getCommunitiesFromCategory);


// /communities/

router.route('/communities')
	.post(communityController.addCommunity)
	.get(communityController.getCommunities)
;

router.route('/communities/:community_id')
	.get(communityController.getCommunity)
	.delete(communityController.deleteCommunity)
	.put(communityController.updateCommunity)
;




// /challenges/

router.route('/challenges')
	.post(challengesController.addChallenge)
	.get(challengesController.searchChallenges)
;

router.route('/challenges/:challenge_id')
	.delete(challengesController.deleteChallenge)
	.put(challengesController.updateChallenge)
	.get(challengesController.getChallenge)
;


// /chatrooms

router.route('/chatrooms')
	.post(chatroomsController.addChatrooms)
	.get(chatroomsController.searchChatrooms)
;

router.route('/chatrooms/:chatroom_id')
	.delete(chatroomsController.deleteChatrooms)
	.put(chatroomsController.updateChatroom)
	.get(chatroomsController.getChatroom)
;

router.route('/chatroomsCommunity/:chatroom_id')
	.put(chatroomsController.addCommunityChatroom)
;


// /messages/

router.route('/messages')
	.post(messagesController.addMessage)
	.get(messagesController.searchMessage)
;

router.route('/messages/:message_id')
	.delete(messagesController.deleteMessage)
	.put(messagesController.updateMessage)
	.get(messagesController.getMessage)
;
 

// /posts/

router.route('/posts')
	.post(postsController.addPost)
	.get(postsController.searchPosts)
;

router.route('/posts/:post_id')
	.delete(postsController.deletePost)
	.put(postsController.updatePost)
	.get(postsController.getPost)
;

// /resources/

router.route('/resources')
	.get(resourceController.getResources)
	.post(resourceController.addResource)
;

router.route('/resources/:resource_id')
	.post(resourceController.addHyperlinkToResource)
	.put(resourceController.updateResource)
;


// DOCUMENTATION SETUP

// Swagger set up
const options = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Time to document that Express API you built",
			version: "1.0.0",
			description: "A test project to understand how easy it is to document and Express API",
			license: {
				name: "Apache 2.0",
				url: "https://opensource.org/licenses/Apache-2.0"
			},
			contact: {
				name: "Swagger",
				url: "https://swagger.io",
				email: "Info@SmartBear.com"
			}
		},
		servers: [
			{
				url: "http://localhost:8080/api/"
			}
		]
	},
	apis: []
  };

  const specs = swaggerJsdoc(options);

  router.use("/docs", swaggerUi.serve);

  router.get(
	"/docs",
	swaggerUi.setup(specs, {
	  explorer: true
	})
  );


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

