var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');

var userController = require('./controllers/userController');
var topicController = require('./controllers/topicController');

var app = express();
var router = express.Router();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// session configuration
app.use(session({ secret: 'cs316projectsession' }));
app.use(passport.initialize());
app.use(passport.session());

require('../config/passport')(passport); // pass passport for configuration

/* 
 =====================================
 FACEBOOK ROUTES =====================
 =====================================
*/

// route for facebook authentication and login
router.route('/login')
	.get(passport.authenticate('facebook'));

// handle the callback after facebook has authenticated the user
router.route('/login/callback')
	.get(passport.authenticate('facebook', { failureRedirect: '/' }), 
		function (req, res, next) {
			res.redirect('/topic');
		});

router.route('/logout')
	.get(function(req, res) {
		req.logout();
		res.redirect('/');
	});


/*
========================================
INTERNAL API ROUTES
========================================
*/
//Topic routes
router.get('/api/topic/:pageNum', userController.isLoggedIn, topicController.getTopics);
router.post('/api/topic', userController.isLoggedIn, topicController.postTopic);

//Opinion route



/*
 =====================================
 CUSTOM ROUTES =====================
 =====================================
*/

router.route('/topic')
	.get(userController.isLoggedIn, function(req, res) {
		// code here to direct to actual page?
		res.sendFile(path.resolve(__dirname + '/../public/topic.html'));
	})
	.post(userController.isLoggedIn, topicController.postTopic);

app.use('/', router);

// serve static file
app.use(express.static(__dirname + '/../public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler to print stack trace
if (app.get('env') == 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			code: 'failure',
			message: err.message,
			stack: err.stack
		});
	});
}

// production error handler so no stack track is shown to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		code: 'failure',
		message: err.message
	});
});

module.exports = app;