function postTopic(req, res, next) {
	db.User.findOne({
		where: {
			fb_id: req.user.id
		}
	}).then(function(user) {
		db.Topic.create({
			title: "Duke Basketball Players",
			category: "Sports",
			num_votes: 1,
			created_by: user.id 
		})
		.then(function() {
			res.send({
				status: "success"
			});
		});
	});
}

module.exports = {
	postTopic: postTopic
};