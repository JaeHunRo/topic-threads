const React = require('react');
const OpinionPreview = require('./OpinionPreview');
const Comment = require('./Comment');
const CommentComposer = require('./CommentComposer');
const OpinionComposer = require('./OpinionComposer');
const TopicInfo = require('./TopicInfo');
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
      opinionComposerShown: false,
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
      opinionComposerShown: !this.state.opinionComposerShown
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
          }, () => {
            console.log('has been cleared?', this.state.opinionValue);
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
    this.setState({
      opinionValue: ''
    });
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
              {opinion.opinionAuthor.split(' ')[0]}
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
    if (this.state.commentValue == '') {
      return;
    }
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
            <TopicInfo
              viewedTopic={this.props.viewedTopic}
              categories={this.props.categories}/>
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
            <CommentComposer
              commentValue={this.state.commentValue}
              handleCommentChange={this.handleCommentChange.bind(this)}
              createComment={this.createComment.bind(this)}
              cancelComment={this.cancelComment.bind(this)}
              postingComment={this.state.postingComment}
            />
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
        <OpinionComposer
          composerShown={this.state.opinionComposerShown}
          opinionValue={this.state.opinionValue}
          handleOpinionChange={this.handleOpinionChange.bind(this)}
          createOpinion={this.createOpinion.bind(this)}
          cancelOpinion={this.cancelOpinion.bind(this)}
          postingOpinion={this.props.postingOpinion}
          />
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
