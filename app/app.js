var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// the following are routes

app.route('/topic')
	// POST /topic - creates basic topic thread
	.get(function(req, res) {
		res.send('hello world!');
	});

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