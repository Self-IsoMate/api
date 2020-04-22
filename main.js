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


/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Managing user accounts
 * 
 * path:
 *   /users:
 *      post:
 *          summary: Creates a new user and sends a verification email.
 *          tags: [Users]
 *          requestBody:
 *              required: true
 *              content:
 *                application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                            username:
 *                                type: string
 *                            email:
 *                                type: string
 *                            profilePicture:
 *                                type: string
 *                            password:
 *                                type: string
 *          responses:
 *              "200":
 *                  description: The created user
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  user:
 *                                      $ref: '#/components/schemas/User'
 *      get:
 *          summary: Returns a list of users based on filters
 *          tags: [Users]
 *          parameters:
 *              - in: query
 *                name: _id
 *                schema:
 *                  type: string
 *                description: User ID (automatically generated)
 *              - in: query
 *                name: username
 *                schema:
 *                  type: string
 *                description: Username of the user
 *              - in: query
 *                name: email
 *                schema:
 *                  type: string
 *                description: Email of the user
 *              - in: query
 *                name: isVerified
 *                schema:
 *                  type: boolean
 *                description: Flag to show whether the user has verified their email
 *              - in: query
 *                name: profilePicture
 *                schema:
 *                  type: string
 *                description: URL to the user's profile picture
 *              - in: query
 *                name: dateCreated
 *                schema:
 *                  type: date
 *                description: Date the account was created
 *              - in: query
 *                name: bio
 *                schema:
 *                  type: string
 *                description: User's bio
 *          responses:
 *              "200":
 *                  description: List of users fitting the filters provided
 *                  content:
 *                      application/json:
 *                          schema:
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  users:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/User'
 */
router.route('/users')
	.post(userController.addUser)
	.get(userController.findUser)
;


/**
 * @swagger
 * path:
 *  /users/{user_id}:
 *      delete:
 *          summary: Deletes a user's account.
 *          tags: [Users]
 *          parameters:
 *              - in: path
 *                name: user_id
 *                type: string
 *                description: ID of the user to delete
 *          responses:
 *              "200":
 *                  description: Successfully deleted user.
 *      put:
 *          summary: Update a user's account info.
 *          tags: [Users]
 *          parameters:
 *              - in: path
 *                name: user_id
 *                type: string
 *                description: ID of the user to update.
 *          responses:
 *              "200":
 *                  description: Successfully updated user.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  user:
 *                                      $ref: '#/components/schemas/User'
 */
router.route('/users/:user_id')
    .delete(userController.deleteUser)
	.put(userController.updateUser)
;


/**
 * @swagger
 * 
 * path:
 *  /users/{user_id}/communities:
 *      post:
 *          summary: Add a community to a user.
 *          tags: [Users]
 *          parameters:
 *              - in: path
 *                name: user_id
 *                type: string
 *                description: ID of the user to add the community to.
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              communityId:
 *                                  type: string
 *          responses:
 *              "200":
 *                  description: Successfully added community to user.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  user:
 *                                      $ref: '#/components/schemas/User'
 *              "404":
 *                  description: User or community not found.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  message:
 *                                      type: string
 */
router.route('/users/:user_id/communities')
	.post(userController.addCommunity)
	.get(userController.getCommunitiesFromUser)
;

router.route('/users/:user_id/chatrooms/')
	.post(userController.addChatroom)
;

router.route('/users/:user_id/chatrooms')
	.get(userController.getChatroomsFromUser)
;

router.route('/users/:user_id/chatrooms/:chatroom_id') 
	.delete(userController.removeChatroom)

/**
 * @swagger
 *  path:
 *      /users/{user_id}/communities/{community_id}:
 *          delete:
 *              summary: Delete community from a user.
 *              tags: [Users]
 *              parameters:
 *                  - in: path
 *                    name: user_id
 *                    type: string
 *                    description: ID of the user to delete the community from
 *                  - in: path
 *                    name: community_id
 *                    type: string
 *                    description: ID of the community to remove from the user.
 *              responses:
 *                  "200":
 *                      description: Community was successfully deleted from user.
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  properties:
 *                                      success:
 *                                          type: boolean
 *                                      user:
 *                                          $ref: '#/components/schemas/User'
 *  
 */
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

/**
 * @swagger
 * tags:
 *  name: Categories
 *  description: Category manager
 * 
 * path:
 *  /categories:
 *      post:
 *          summary: Add a new category.
 *          tags: [Categories]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              name:
 *                                  type: string
 *                              image:
 *                                  type: string
 *                              parentId:
 *                                  type: string
 *                              communities:
 *                                  type: array
 *                                  items:
 *                                      type: string
 *          responses:
 *              "200":
 *                  description: Successfully added category.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  category:
 *                                      $ref: '#/components/schemas/Category'
 *      get:
 *          summary: Gets a list of categories based on filters.
 *          tags: [Categories]
 *          parameters:
 *              - in: query
 *                name: _id
 *                schema:
 *                  type: string
 *                description: ID of the category
 *              - in: query
 *                name: name
 *                schema:
 *                  type: string
 *                description: Name of the category
 *              - in: query
 *                name: image
 *                schema:
 *                  type: string
 *                description: URL of the image associated with a category
 *              - in: query
 *                name: isChild
 *                schema:
 *                  type: boolean
 *                description: Whether category has a parent category or not
 *              - in: query
 *                name: isLeaf
 *                description: Whether category has any child categories or not
 *                schema:
 *                  type: boolean
 *          responses:
 *              "200":
 *                  description: Successfully returned a list of categories
 *                  content:
 *                      application/json:
 *                          schema:
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  categories:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/Category'
 */
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

/**
 * @swagger
 * 
 * tags:
 *  name: Feed
 *  description: Endpoints for a user's feed
 * 
 * path:
 *  /feed/{user_id}:
 *      get:
 *          summary: Get a user's feed
 *          tags: [Feed]
 *          parameters:
 *              - in: path
 *                name: user_id
 *                schema:
 *                  type: string
 *                description: ID of the user to get the feed for
 *          responses:
 *              "200":
 *                  description: Successfully returned posts in user's feed
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  feed:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/Post'
 *              "404":
 *                  description: User was not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  message:
 *                                      type: string
 *              "500":
 *                  description: Exception occurred when retrieving data from the DB.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                  message:
 *                                      type: string
 * 
 */
router.route('/feed/:user_id')
	.get(userController.getFeed);


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
			title: "Self IsoMate API",
			version: "1.0.0",
			description: "API to provide an easy interface between application software and the database",
		},
		servers: [
            {
                url: "http://self-isomate-api.appspot.com/api/",
                description: "Live server"
            },
			{
                url: "http://localhost:8080/api/",
                description: "Local server (must be running locally)"
            }
		]
	},
	apis: [ './src/users/users.model.js', './main.js', './src/categories/categories.model.js', './src/posts/posts.model.js' ]
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

