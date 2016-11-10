#!/usr/bin/env node

var app = require('./app/app.js');
var db = require('./app/models/');

/*
 Test postgres connection
*/
db.sequelize
	.authenticate()
	.then(function(err) {
	  console.log('Connection has been established successfully.');
	}, function (err) { 
	  console.log('Unable to connect to the database:', err);
	});

/*
 Get port from environment and store in Express.
*/

var port = process.env.PORT || '3001';

/*
 Sync postgres db with sequelize models and listen on provided port, on all network interfaces and connect to db.
*/
db.sequelize.sync().then(function() {
	app.listen(port, function() {
		console.log("Listening on port: " + port);
	});
});