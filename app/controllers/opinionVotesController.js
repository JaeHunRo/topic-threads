var async = require('async');

/*
Grabs number of votes of each votetype for each opinion and appends to the result.
*/
function getOpinionVotes(req, res){
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
}

module.exports = {
    getOpinionVotes: getOpinionVotes
};