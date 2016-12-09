var async = require('async');

/*
Number of topics to show per page.
*/
var numTopicsToShow = 50;


/*
Grabs a specified number of topics to show (taking into account offsets).
For each topic, it checks the TopicVotes table to see whether the user has
already voted on that particular topic. Appends a hasVoted attribute to the
result, then sends it back as a response.
*/
function getTopics(req, res){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.Topic.findAndCountAll({
            limit: numTopicsToShow,
            offset: numTopincsToShow * (req.params.pageNum - 1)
        }).then(function(result){
            var topics = result.rows;
            async.each(topics, function(topic, callback){
                db.TopicVotes.findOne({
                    where: {
                        topic_id: topic.id,
                        user_id: user.id 
                    }
                }).then(function(vote){
                    topic.dataValues.hasVoted = !(vote == null);
                    callback();
                });
            }, function(){
                res.send(result);
            });
        })
    });
}

function postTopic(req, res, next) {
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user) {
        db.Topic.create({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            user_id: user.id 
        })
        .then(function() {
            res.send({
                status: "success"
            });
        });
    });
}

module.exports = {
    postTopic: postTopic,
    getTopics: getTopics
};