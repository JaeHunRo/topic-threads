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
Returns a detailed list of votes for one specific topic.
*/
function getDetailedTopicVotes(req, res){
    db.TopicVotes.findAndCountAll({
        where: {
            topic_id: req.params.topicId,
        }
    }).then(function(result){
        var topicVotes = result.rows;
        async.each(topicVotes, function(topic, callback){
            db.User.findOne({
                where: {
                    id: topic.user_id
                }
            }).then(function(user){
                topic.dataValues.username = user.dataValues.username;
                callback();
            })
        }, function(){
            res.send(result);
        });
    });
}

/*
Posts a topic vote associated with a particular topic.
Required in the request body: topic_id and isUp (a boolean).
Checks to see whether the user has already voted on a particular topic. If they 
haven't, the topic vote is posted.
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
                topic_id: req.params.topicId
            }
        })
        .then(function(vote){
            console.log(vote);
            if (vote == null){
                db.TopicVotes.create({
                    user_id: user.id,
                    topic_id: req.params.topicId,
                    isUp: req.body.is_up
                })
                .then(function(){
                    res.status(200).send({
                        message: "Vote posted."
                    });
                });
            }else{
                res.status(400).send({
                    message: "User has already voted."
                })
            }
        });
    });
}

module.exports = {
    getTopicVotes: getTopicVotes,
    postTopicVote: postTopicVote,
    getDetailedTopicVotes: getDetailedTopicVotes
};