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
function postTopicVotes(req, res) {

}

module.exports = {
    getTopicVotes: getTopicVotes
};