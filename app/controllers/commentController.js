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
        res.send(result);
    });
}

function postComment(req, res, next) {
    db.User.findOne({
        where: {
            fb_id: req.headers.id
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
    getComments: getComments
};