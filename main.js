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

var userController = require('./src/users/users.controller');
var communityController = require('./src/communities/communities.controller');
// SCHEMAS


const CONNECTION_STRING = 'mongodb+srv://sophie:applesAndOranges@self-isomatedb-8bnuw.gcp.mongodb.net/test?retryWrites=true&w=majority';

// FUNCTIONS FOR API

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true, useFindAndModify: false});

app.use(express.static('www'));
app.set('port', process.env.PORT || 5000);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// more routes for our API will happen here

router.route('/users')
    .post(userController.addUser);

router.route('/users/:user_id')
    .delete(userController.deleteUser)
    .put(userController.updateUser);

// community routes

router.route('/communities')
	.post(communityController.addCommunity)
;

router.route('/communities/:community_id')
	.get(communityController.getCommunity)
	.delete(communityController.deleteCommunity)
	.put(communityController.updateCommunity)
;

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

