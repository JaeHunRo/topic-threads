#!/usr/bin/env node

var app = require('./app/app.js');

// connect postgres

/**
 * Get port from environment and store in Express.
 */

var port = process.env.PORT || '3001';

/**
 * Listen on provided port, on all network interfaces.
 */

app.listen(port);
