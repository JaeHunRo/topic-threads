const React = require('react');
const OpinionPreview = require('./OpinionPreview');
const Comment = require('./Comment');
const $ = require('jquery');
const views = {
  Topic: 0,
  Comments: 1
}

export class TopicViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: views.Topic,
      commentsFor: {},
      commentList: [],
      composerShown: false,
      opinionValue: '',
      loadingComments: false,
      commentValue: '',
      postingComment: false
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.expanded && nextProps.expanded != this.props.expanded) {
      this.setState({
        currentView: views.Topic,
        commentsFor: {}
      });
    }
  }

  toggleViewer() {
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('topic-expanded');
    this.props.toggleViewer();
  }

  renderOpinionPreviews() {
    if (this.props.opinions && this.props.opinions.length == 0 && !this.props.loadingOpinions || !this.props.opinions) {
      return (
        <div className="no-opinions">
          <div>
            No opinions yet!
          </div>
        </div>
      );
    } else if (this.props.loadingOpinions) {
      return (
        <div className="loading-opinions-container">
          <div className="loading-opinions">
            <img src="src/assets/loading.gif"/>
            <div>Loading Opinions...</div>
          </div>
        </div>
      );
    }
    const previews = [];
    this.props.opinions.forEach((opinion, index) => {
      previews.push(
        <OpinionPreview
          key={opinion.id+'-opinion-preview'}
          info={opinion}
          selectOpinionVote={this.selectOpinionVote.bind(this)}
          viewCommentList={this.viewCommentList.bind(this)}
          colorUtil={this.props.colorUtil}
          viewedTopic={this.props.viewedTopic}/>
      );
    });
    return previews;
  }

  selectOpinionVote(voteType, opinionId) {
    console.log('voted', voteType, "on", opinionId);
    for (let i = 0; i < this.props.opinions.length; i++) {
      const opinion = this.props.opinions[i];
      if (opinion.id == opinionId) {
        console.log("before", opinion.voteCount);
        let requestType = '';
        const userVote = opinion.userPreviouslyVoted;
        if (userVote) {
          if (userVote == voteType) {
            // user is unvoting
            opinion.voteCount[voteType] = opinion.voteCount[voteType] - 1;
            opinion.userPreviouslyVoted = null;
            requestType = 'DELETE';
          } else {
            // user is switching vote
            opinion.voteCount[userVote] = opinion.voteCount[userVote] - 1;
            opinion.voteCount[voteType] = opinion.voteCount[voteType] ? opinion.voteCount[voteType] + 1 : 1;
            opinion.userPreviouslyVoted = voteType;
            requestType = 'PUT';
          }
        } else {
          //user is making new vote
          opinion.voteCount[voteType] = opinion.voteCount[voteType] ? opinion.voteCount[voteType] + 1 : 1;
          opinion.userPreviouslyVoted = voteType;
          requestType = 'POST';
        }
        console.log("after", opinion.voteCount);

        let request = {
          contentType: 'application/json',
          url: '/api/opinion_votes/topicId/' + this.props.viewedTopic.id + '/opinionId/' + opinionId,
          type: requestType
        }

        if (requestType == 'POST' || requestType == 'PUT') {
          request.data = JSON.stringify({
            'type': voteType
          });
          request.dataType = 'json';
        }

        const voteRequest = $.ajax(request);
        const voteGetRequest = $.ajax({
          contentType: 'application/json',
          url: '/api/opinion/topicId/' + this.props.viewedTopic.id + '/opinionId/' + opinionId,
          type: 'GET'
        });

        $.when(voteRequest).done((data) => {
          console.log('vote completed', data);
          $.when(voteGetRequest).done((response) => {
            console.log('response vote data', response);
            this.props.updateOpinion(response);
          });
        });

        return;
      }
    }
  }

  viewCommentList(opinion) {
    console.log("go to", opinion.id);
    this.setState({
      commentsFor: opinion,
      currentView: views.Comments,
      loadingComments: true,
    }, () => {
      this.retrieveComments();
    });
  }

  backToOpinions() {
    this.setState({
      currentView: views.Topic,
      commentsFor: {}
    });
  }

  toggleOpinionComposer() {
    this.setState({
      composerShown: !this.state.composerShown
    });
  }

  createOpinion() {
    if (this.state.opinionValue.length == 0) {
      return;
    }
    let opinion = {
      "content": this.state.opinionValue
    }

    console.log(opinion);
    const opinionCreateRequest = $.ajax({
      contentType: 'application/json',
      url: 'api/opinion/topicId/' + this.props.viewedTopic.id,
      type: 'POST',
      data: JSON.stringify(opinion),
      dataType: 'json'
    });

    $.when(opinionCreateRequest).done((data) => {
      console.log('response', data);
      this.props.startLoading(() => {
        this.props.addNewOpinion(() => {
          this.toggleOpinionComposer();
          this.setState({
            opinionValue: ''
          });
        });
      });
    });
  }

  retrieveComments(callback) {
    const commentsRequest = $.ajax({
      contentType: 'application/json',
      url: '/api/comment/topicId/' + this.props.viewedTopic.id + '/opinionId/' + this.state.commentsFor.id + '/pageNum/' + this.props.topicPage,
      type: 'GET'
    });

    console.log('comments request');

    $.when(commentsRequest).done((data) => {
      console.log('response', data);
      this.setState({
        commentList: data.rows,
        loadingComments: false
      }, callback);
    });
  }

  cancelOpinion() {
    this.toggleOpinionComposer();
  }

  handleOpinionChange(event) {
    this.setState({
      opinionValue: event.target.value
    });
  }

  renderOpinionAuthor() {
    let opinion = this.state.commentsFor;
    if (!opinion) {
      return null;
    } else {
      return (
        <div className="topic-opinion-info">
          <div>{"-"}</div>
          <div className="topic-opinion-author-icon" style={{
            backgroundColor: this.props.colorUtil.getColor(opinion.user_id)
          }}>
            {opinion.opinionAuthor.charAt(0)}
          </div>
          <div className="topic-opinion-metadata">
            <div className="topic-opinion-author-name">
              {opinion.opinionAuthor}
            </div>
          </div>
        </div>
      );
    }
  }

  renderOpinionBody() {
    let opinion = this.state.commentsFor;
    if (!opinion) {
      return null;
    } else {
      return (
        <div className="comment-section-opinion-body">
          <span>&ldquo;</span>
          {opinion.content}
          <span>&rdquo;</span>
        </div>
      );
    }
  }

  renderComments() {
    let commentElements = [];
    let comments = this.state.commentList;
    if (comments.length == 0 && !this.state.loadingComments) {
      return (
        <div className="comments-placeholder-container">
          <div className="no-comments">
            No comments yet!
          </div>
        </div>
      )
    } else if (this.state.loadingComments) {
      return (
        <div className="comments-placeholder-container">
          <div className="loading-comments">
            <img src="src/assets/loading.gif"/>
            <div>Loading Comments...</div>
          </div>
        </div>
      )
    }
    comments.forEach((comment, index) => {
      let commentElement = (
        <Comment
          key={index + "-comment"}
          info={comment}
          colorUtil={this.props.colorUtil} />
      );
      commentElements.push(commentElement);
    });
    return commentElements;
  }

  createComment() {
    if (this.state.commentValue.length == 0) {
      return;
    }
    const comment = {
      "content": this.state.commentValue
    }
    const commentCreateRequest = $.ajax({
      contentType: 'application/json',
      url: 'api/comment/topicId/' + this.props.viewedTopic.id + '/opinionId/' + this.state.commentsFor.id,
      type: 'POST',
      data: JSON.stringify(comment),
      dataType: 'json'
    });

    document.getElementById('comment-composer').disabled = true;
    this.setState({
      postingComment: true,
    }, () => {
      $.when(commentCreateRequest).done((data) => {
        console.log(data);
        this.retrieveComments(() => {
          document.getElementById('comment-composer').disabled = false;
          this.setState({
            postingComment: false,
            commentValue: ''
          });
        });
      });
    });
  }

  cancelComment() {
    this.setState({
      commentValue: ''
    });
  }

  handleCommentChange(event) {
    this.setState({
      commentValue: event.target.value
    });
  }

  renderContent() {
    if (!this.props.viewedTopic) {
      return null;
    }
    switch(this.state.currentView) {
      case views.Topic:
        return (
          <div>
            <div className="topic-viewer-title">
              {this.props.viewedTopic.title}
            </div>
            <div className="topic-viewer-info">
              <div className="topic-viewer-category">
                <div className="topic-viewer-category-icon-container">
                  <img
                    src={
                      'src/assets/' + this.props.categories[this.props.viewedTopic.category].icon
                    }
                    className="topic-viewer-category-icon"/>
                </div>
                <div className="topic-viewer-category-name">
                  {this.props.categories[this.props.viewedTopic.category].label}
                </div>
              </div>
              <div className={
                this.props.viewedTopic.description.length == 0
                ? "topic-viewer-description empty"
                : "topic-viewer-description"
              }>
                {
                  this.props.viewedTopic.description.length == 0
                  ? (
                    <div className="empty-message">
                      No description.
                    </div>
                  ) : null
                }
                {this.props.viewedTopic.description}
              </div>
            </div>
            <div
              className="topic-viewer-opinions-section"
              style={{
                width: (this.props.dimensions[0] - 320) + 'px',
                height: (this.props.dimensions[1] - 435) + 'px'
              }}>
              {this.renderOpinionPreviews()}
            </div>
            <div className="add-opinion">
              <div className="add-opinion-label">Add Opinion</div>
              <div
                className="add-opinion-button"
                onClick={this.toggleOpinionComposer.bind(this)}>
                <i className="fa fa-plus" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        );
      case views.Comments:
        return (
          <div className="comment-section">
            <div className="comment-section-opinion-info">
              <div className="comment-section-opinion-body-container">
                {this.renderOpinionBody()}
              </div>
              <div className="comment-section-opinion-author">
                {this.renderOpinionAuthor()}
              </div>
            </div>
            <div className="comment-composer-container">
              <textarea
                id="comment-composer"
                className="comment-composer"
                placeholder="Write a comment..."
                value={this.state.commentValue}
                onChange={this.handleCommentChange.bind(this)}>
              </textarea>
              <div className="comment-composer-buttons">
                <div
                  className={
                    this.state.commentValue.length == 0
                    ? "comment-composer-post-button unselectable disabled"
                    : "comment-composer-post-button unselectable"
                  }
                  onClick={this.createComment.bind(this)}>
                  <div>
                    {
                      this.state.postingComment
                      ? (
                        <img src="src/assets/loading.gif"/>
                      )
                      : "Post"
                    }
                  </div>
                </div>
                <div
                  className="comment-composer-cancel-button unselectable"
                  onClick={this.cancelComment.bind(this)}>
                  <div>Cancel</div>
                </div>
              </div>
            </div>
            <div className="comments">
              {this.renderComments()}
            </div>
          </div>
        );
    }
  }

  render() {
    return (
      <div
        id="topic-viewer"
        className={this.props.expanded ? "topic-expanded" : ""}
        style={{
          width: (this.props.dimensions[0] - 300) + 'px',
          height: (this.props.dimensions[1] - 100) + 'px',
          left: '150px',
          top: '50px'
        }}>
        <div
          className={
            this.state.composerShown
            ? "opinion-composer-container shown"
            : "opinion-composer-container"
          }>
          <div className="opinion-composer">
            <div className="opinion-composer-text">
              <div className="opinion-composer-label">
                {"What's Your Opinion?"}
              </div>
              <textarea
                className="opinion-composer-text-area"
                value={this.state.opinionValue}
                onChange={this.handleOpinionChange.bind(this)}
                maxLength="1000">
              </textarea>
              <div className="opinion-composer-char-limit">
                {this.state.opinionValue.length + " / 1000"}
              </div>
            </div>
            <div className="opinion-composer-buttons">
              <div
                className={
                  this.state.opinionValue.length == 0
                  ? "opinion-composer-create-button unselectable disabled"
                  : "opinion-composer-create-button unselectable "
                }
                onClick={this.createOpinion.bind(this)}>
                {
                  this.props.postingOpinion
                  ? (
                    <img src="src/assets/loading.gif"/>
                  )
                  : "Create"
                }
              </div>
              <div
                className="opinion-composer-cancel-button unselectable"
                onClick={this.cancelOpinion.bind(this)}>
                Cancel
              </div>
            </div>
          </div>
        </div>
        <div
          className="exit-topic-viewer"
          onClick={this.toggleViewer.bind(this)}>
          <img src="src/assets/close-icon.png" width={20} height={20}/>
        </div>
        {
          this.state.currentView == views.Comments
          ? (
            <div className="back-to-opinions" onClick={this.backToOpinions.bind(this)}>
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
            </div>
          ) : null
        }
        {this.renderContent()}
      </div>
    );
  }
}

module.exports = TopicViewer;
