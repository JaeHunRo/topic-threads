/*
	Middleware for requests requiring user authentication.
*/
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
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
			callback(null, profile);
		} else {
			global.db.User.create({
				fb_id: profile.id,
				username: profile.displayName,
				admin: false
			})
			.then(function() {
				callback(null, profile);
			});
		}
	});
}

/*
Simple API call which can be used to check the admin status of a user
(Perhaps for delete access?)
Ends up returning an object containing all of the user information.
*/
function getUserStatus(req, res){
	db.User.findOne({
		where: {
			fb_id: req.user.id
		}
	}).then(function(user){
		if (user == null){
			res.status(400).send({error: "Could not find user."});
		}
		res.status(200).send(user);
	})
}

module.exports = {
	isLoggedIn: isLoggedIn,
	registerUser: registerUser,
	getUserStatus: getUserStatus
};
