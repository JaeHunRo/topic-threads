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
function getAllTopics(req, res, next){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.Topic.findAndCountAll({
            limit: numTopicsToShow,
            offset: numTopicsToShow * (req.params.pageNum - 1)
        }).then(function(result){
            var topics = result.rows;
            async.each(topics, function(topic, callback){
                db.TopicVotes.findOne({
                    where: {
                        topic_id: topic.id,
                        user_id: user.id 
                    }
                }).then(function(vote){
                    console.log(vote);
                    topic.dataValues.userPreviouslyVoted = vote.dataValues.isUp || null;
                    callback();
                });
            }, function(){
                req.result = result;
                next();
            });
        })
    });
}

/*
Gets information associated with a particular topic. Nothing
additional necessary in the request body. Also appends the
number of upvotes and downvotes onto returned data.
*/
function getTopic(req, res, next){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.Topic.findOne({
            where: {
                id: req.params.topic_id
            }
        }).then(function(result){
            if (result == null){
                res.send({
                    status: 400,
                    message: "No topics with this ID found."
                });
            }
            db.TopicVotes.findAndCountAll({
                where: {
                    topic_id: req.params.topic_id
                }
            }).then(function(votes){
                var votes = votes.rows;
                var numUpvotes = 0;
                var numDownvotes = 0;
                result.dataValues.userPreviouslyVoted = null;
                for (var i = 0; i < votes.length; i++){
                    if (votes[i].isUp) numUpvotes++;
                    if (votes[i].user_id === user.id){
                        result.dataValues.userPreviouslyVoted = votes[i].isUp;
                    }
                }
                result.dataValues.numUpvotes = numUpvotes;
                result.dataValues.numDownvotes = votes.length - numUpvotes;
                res.send(result);
           });
        });
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
                status: 200,
                message: "success"
            });
        });
    });
}

module.exports = {
    postTopic: postTopic,
    getAllTopics: getAllTopics,
    getTopic: getTopic
};