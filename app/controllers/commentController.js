var async = require('async');
/*
Number of comments to show per page.
*/
var numCommentsToShow = 50;


/*
Grabs a specified number of comments to show (taking into account offsets) then sends it back as a response.
*/

function getComments(req, res, next) {
    db.Comment.findAndCountAll({
        where: {
            topic_id: req.params.topicId,
            opinion_id: req.params.opinionId
        },
        limit: numCommentsToShow,
        offset: numCommentsToShow * (req.params.pageNum - 1)
    }).then(function(result){
        var comments = result.rows;
        async.each(comments, function(comment, callback){
            db.User.findOne({
                where: {
                    id: comment.user_id
                }
            }).then(function(user){
                comment.dataValues.commentAuthor = user.dataValues.username;
                callback();
            });
        }, function(){
            res.send(result);
        });
    });
}

function getCommentCountForAllTopics(req, res, next) {
  var opinions = req.result.rows;
  async.each(opinions, function(opinion, callback) {
    db.Comment.count({
      where: {
        topic_id: opinion.dataValues.topic_id,
        opinion_id: opinion.dataValues.id
      }
    }).then(function(count) {
      opinion.dataValues.commentCount = count;
      callback();
    })
  }, function(){
    res.send(req.result);
  });
}

/**
Get all the comments that one particular user has posted, sorted by most recent.
*/
function getCommentsForUser(req, res, next){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.Comment.findAndCountAll({
            where: {
                user_id: user.id
            },
            order: '"updatedAt" DESC'
        }).then(function(result){
            if (!req.hasOwnProperty('result')){
                req.result = {};
            }
            req.result.comments = result;
            next();
        }).catch(function(error){
            res.status(400).send({
                message: "There was an error retrieving comments for this user."
            });
        })
    });
}

function postComment(req, res, next) {
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user) {
        db.Comment.create({
            content: req.body.content,
            user_id: user.id,
            topic_id: req.params.topicId,
            opinion_id: req.params.opinionId
        })
        .then(function() {
            res.status(200).send({
                message: "Comment successfully posted."
            });
        }).catch(function(err){
            res.status(400).send({
                message: "There was an error posting your comment."
            });
        });
    });
}


module.exports = {
    postComment: postComment,
    getComments: getComments,
    getCommentsForUser: getCommentsForUser,
    getCommentCountForAllTopics: getCommentCountForAllTopics
};
