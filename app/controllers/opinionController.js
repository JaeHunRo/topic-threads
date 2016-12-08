var async = require('async');

/*
Number of opinions to show per page.
*/
var numOpinionsToShow = 50;


/*
Grabs a specified number of opinions to show (taking into account offsets).
For each opinion, it checks the OpinionVotes table to see whether the user has
already voted on that particular opinion, and if so what type of vote it was. Appends a voteType attribute, then sends it back as a response.
*/

function getOpinions(req, res, next) {
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user) {
        db.Opinion.findAndCountAll({
            where: {
                topic_id: req.params.topicId
            },
            limit: numOpinionsToShow,
            offset: numOpinionsToShow * (req.params.pageNum - 1)
        }).then(function(result){
            var opinions = result.rows;
            async.each(opinions, function(opinion, callback){
                db.OpinionVotes.findOne({
                    where: {
                        topic_id: opinion.topic_id,
                        opinion_id: opinion.id, 
                        user_id: user.id 
                    }
                }).then(function(vote){
                    if (vote == null){
                        opinion.dataValues.voteType = null;
                    }else{
                        opinion.dataValues.voteType = vote.type;
                    }
                    callback();
                });
            }, function(){
                res.send(result);
            });
        })
    });
}

function postOpinion(req, res, next) {
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user) {
        db.Opinion.create({
            content: req.body.content,
            user_id: user.id,
            topic_id: req.params.topicId
        })
        .then(function() {
            res.send({
                status: "success"
            });
        });
    });
}

module.exports = {
    postOpinion: postOpinion,
    getOpinions: getOpinions
};