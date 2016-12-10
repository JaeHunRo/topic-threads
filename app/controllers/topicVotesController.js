var async = require('async');

/*
Grabs the upvotes/downvotes for each topic and appends to the result.
*/
function getTopicVotes(req, res){
    var topics = req.result.rows;
    async.each(topics, function(topic, callback){
        db.TopicVotes.findAndCountAll({
            where: {
                topic_id: topic.id
            }
        }).then(function(votes){
            var votesRows = votes.rows;
            var upvotes = votesRows.filter(function(el) {
                return el.dataValues.isUp;
            }).length;
            var downvotes = votesRows.length - upvotes;
            topic.dataValues.upvotes = upvotes;
            topic.dataValues.downvotes = downvotes;
            callback();
        });
    }, function(){
        res.send(req.result);
    });
}

/*
Creates topicVote given user_id, topic_id, and isUp. 
Could check to make sure the user has not voted already on a topic, or that could be middleware.
*/
function postTopicVote(req, res) {
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.TopicVotes.findOne({
            where: {
                user_id: user.id,
                topic_id: req.body.topic_id
            }
        })
        .then(function(vote){
            if (vote == null){
                db.TopicVotes.create({
                    user_id: user.id,
                    topic_id: req.body.topic_id,
                    isUp: req.body.is_up
                })
                .then(function(){
                    res.send({
                        status: "Vote posted."
                    });
                });
            }else{
                res.send({
                    status: "User has already posted."
                })
            }
        });
    });
}

module.exports = {
    getTopicVotes: getTopicVotes,
    postTopicVote: postTopicVote
};