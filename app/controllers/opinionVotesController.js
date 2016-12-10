var async = require('async');

/*
Grabs number of votes of each votetype for each opinion and appends to the result.
*/
function getOpinionVotes(req, res){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        var opinions = req.result.rows;
        async.each(opinions, function(opinion, callback){
            db.OpinionVotes.findAndCountAll({
                where: {
                    topic_id: opinion.topic_id,
                    opinion_id: opinion.id
                }
            }).then(function(votes){
                var votesRows = votes.rows;
                var voteCount = {};
                for (var i = 0; i < votesRows.length; i++) {
                    var type = votesRows[i].type;
                    voteCount[type] = (voteCount[type] || 0) + 1;
                }
                opinion.dataValues.voteCount = voteCount;
                callback();
            });
        }, function(){
            res.send(req.result);
        });
    });
}


/*
Returns a detailed list of votes for one specific opinion.
*/
function getDetailedOpinionVotes(req, res){
    db.OpinionVotes.findAndCountAll({
        where: {
            topic_id: req.params.topicId,
            opinion_id: req.params.opinionId
        }
    }).then(function(result){
        var opinionVotes = result.rows;
        async.each(opinionVotes, function(opinion, callback){
            db.User.findOne({
                where: {
                    id: opinion.user_id
                }
            }).then(function(user){
                console.log(user);
                opinion.dataValues.username = user.dataValues.username;
                callback();
            })
        }, function(){
            res.send(result);
        });
    });
}

/*
Adds a vote on a particular opinion.
Request body requires: topic_id, opinion_id, and type ("savage", etc.)
First checks to see if the user has already voted on that particular opinion,
then posts the vote if they have not.
*/
function postOpinionVote(req, res){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.OpinionVotes.findOne({
            where: {
                user_id: user.id,
                topic_id: req.body.topic_id,
                opinion_id: req.body.opinion_id
            }
        })
        .then(function(vote){
            if (vote == null){
                db.OpinionVotes.create({
                    user_id: user.id,
                    topic_id: req.body.topic_id,
                    opinion_id: req.body.opinion_id,
                    type: req.body.type
                })
                .then(function(){
                    res.send({
                        status: "Opinion vote posted."
                    });
                });
            }else{
                res.send({
                    status: "User has already voted on opinion."
                });
            }
        });
    });
}

module.exports = {
    getOpinionVotes: getOpinionVotes,
    postOpinionVote: postOpinionVote,
    getDetailedOpinionVotes: getDetailedOpinionVotes
};