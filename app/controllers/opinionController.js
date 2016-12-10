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
function getAllOpinions(req, res, next) {
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
                        opinion.dataValues.userPreviouslyVoted = null;
                    }else{
                        opinion.dataValues.userPreviouslyVoted = vote.type;
                    }
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
Gets information associated with a particular opinion. Nothing additional necessary
in the request body. Includes vote counts for the opinion in a field "voteCount."
userPreviouslyVoted field has information regarding what the current user has
already voted on this opinion.
*/
function getOpinion(req, res, next){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.Opinion.findOne({
            where: {
                topic_id: req.params.topicId,
                id: req.params.opinionId
            }
        }).then(function(result){
            db.OpinionVotes.findAndCountAll({
                where: {
                    topic_id: req.params.topicId,
                    opinion_id: req.params.opinionId
                }
            }).then(function(votesResult){
                result.dataValues.userPreviouslyVoted = null;
                var votes = votesResult.rows;
                var voteCount = {};
                for (var i = 0; i < votes.length; i++){
                    if (!voteCount.hasOwnProperty(votes[i].type)){
                        voteCount[votes[i].type] = 1;
                    }else{
                        voteCount[votes[i].type]++;
                    }

                    if (votes[i].user_id == user.id){
                        result.dataValues.userPreviouslyVoted = votes[i].type;
                    }
                }
                result.dataValues.voteCount = voteCount;
                res.send(result);
            });
        });
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
            res.status(200).send({
                message: "Opinion successfully posted!"
            });
        }).catch(function(err){
            res.status(400).send({
                message: "There was an error posting your opinion."
            });
        });
    });
}

module.exports = {
    postOpinion: postOpinion,
    getAllOpinions: getAllOpinions,
    getOpinion: getOpinion
};