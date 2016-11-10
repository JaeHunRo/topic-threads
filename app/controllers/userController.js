/*
	Middleware for requests requiring user authentication.
*/
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

/*
	Register user if logging in for first time.
*/
function registerUser(profile, callback) {
	global.db.User.findAll({
		where: {
			fb_id: profile.id
		}
	}).then(function(user) {
		if (user.length) {
			console.log(user);
			callback(null, profile);
		} else {
			console.log("registering");
			global.db.User.create({
				fb_id: profile.id,
				username: profile.displayName,
				admin: true
			})
			.then(function() {
				callback(null, profile);
			});
		}
	});
}

module.exports = {
	isLoggedIn: isLoggedIn,
	registerUser: registerUser
};