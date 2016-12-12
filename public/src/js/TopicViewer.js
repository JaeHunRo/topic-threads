const React = require('react');
const OpinionPreview = require('./OpinionPreview');
const Comment = require('./Comment');
const views = {
  Topic: 0,
  Comments: 1
}

export class TopicViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: views.Topic,
      commentsFor: -1,
      commentList: null,
      composerShown: false,
      opinionValue: ''
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.expanded && nextProps.expanded != this.props.expanded) {
      this.setState({
        currentView: views.Topic,
        commentsFor: -1
      });
    }
  }

  toggleViewer() {
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('topic-expanded');
    this.props.toggleViewer();
  }

  renderOpinionPreviews() {
    if (this.props.opinions.length == 0) {
      return (
        <div className="no-opinions">
          <div>
            No opinions yet!
          </div>
        </div>
      );
    }
    const previews = [];
    this.props.opinions.forEach((opinion, index) => {
      previews.push(
        <OpinionPreview
          key={index+'-opinion-preview'}
          info={opinion}
          selectOpinionVote={this.selectOpinionVote.bind(this)}
          viewCommentList={this.viewCommentList.bind(this)}/>
      );
    });
    return previews;
  }

  selectOpinionVote(voteType, opinionId) {
    console.log('voted', voteType, "on", opinionId);
    for (let i = 0; i < this.props.opinions.length; i++) {
      const opinion = this.props.opinions[i];
      if (opinion.opinionId == opinionId) {
        console.log("before", opinion.voteCount);
        const userVote = opinion.userPreviouslyVoted;
        if (userVote) {
          if (userVote == voteType) {
            opinion.voteCount[voteType] = opinion.voteCount[voteType] - 1;
            opinion.userPreviouslyVoted = null;
          } else {
            opinion.voteCount[userVote] = opinion.voteCount[userVote] - 1;
            opinion.voteCount[voteType] = opinion.voteCount[voteType] ? opinion.voteCount[voteType] + 1 : 1;
            opinion.userPreviouslyVoted = voteType;
          }
        } else {
          opinion.voteCount[voteType] = opinion.voteCount[voteType] ? opinion.voteCount[voteType] + 1 : 1;
          opinion.userPreviouslyVoted = voteType;
        }
        console.log("after", opinion.voteCount);
        return;
      }
    }
  }

  viewCommentList(opinionId) {
    console.log("go to", opinionId);
    this.setState({
      commentList: {
        opinionId: opinionId
      },
      commentsFor: opinionId,
      currentView: views.Comments
    });
  }

  backToOpinions() {
    this.setState({
      currentView: views.Topic,
      commentsFor: -1
    });
  }

  getViewedOpinion() {
    let opinions = this.props.opinions;
    let opinion;
    for (let i = 0; i < opinions.length; i++) {
      if (opinions[i].opinionId == this.state.commentsFor) {
        opinion = opinions[i];
      }
    }
    return opinion;
  }

  toggleOpinionComposer() {
    this.setState({
      composerShown: !this.state.composerShown
    });
  }

  createOpinion() {
    let opinion = {
      body: this.state.opinionValue
    }
    console.log(opinion);
    this.toggleOpinionComposer();
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
    let opinion = this.getViewedOpinion();
    if (!opinion) {
      return null;
    } else {
      return (
        <div className="topic-opinion-info">
          <div>{"-"}</div>
          <img
            className="topic-opinion-author-profile-pic"
            src={"src/assets/" + opinion.profilePic}/>
          <div className="topic-opinion-metadata">
            <div className="topic-opinion-author-name">
              {opinion.author}
            </div>
          </div>
        </div>
      );
    }
  }

  renderOpinionBody() {
    let opinion = this.getViewedOpinion();
    if (!opinion) {
      return null;
    } else {
      return (
        <div className="comment-section-opinion-body">
          {opinion.body}
        </div>
      );
    }
  }

  renderComments() {
    let commentElements = [];
    let comments = [
      {
          id: 1,
          content: "Hi Phil. I Love You.",
          createdAt: "2016-12-10T08:11:59.269Z",
          updatedAt: "2016-12-10T08:11:59.269Z",
          user_id: 1,
          topic_id: 4,
          opinion_id: 2,
          commentAuthor: "Phil Foo"
      },
      {
          id: 2,
          content: "Hi Phil. I Don't Love You.",
          createdAt: "2016-12-10T08:15:58.243Z",
          updatedAt: "2016-12-10T08:15:58.243Z",
          user_id: 1,
          topic_id: 4,
          opinion_id: 2,
          commentAuthor: "Phil Foo"
      },
      {
          id: 3,
          content: "Hi Phil. I Don't Love You.",
          createdAt: "2016-12-10T08:15:58.243Z",
          updatedAt: "2016-12-10T08:15:58.243Z",
          user_id: 1,
          topic_id: 4,
          opinion_id: 2,
          commentAuthor: "Phil Foo"
      },
      {
          id: 4,
          content: "Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You.",
          createdAt: "2016-12-10T08:15:58.243Z",
          updatedAt: "2016-12-10T08:15:58.243Z",
          user_id: 1,
          topic_id: 4,
          opinion_id: 2,
          commentAuthor: "Phil Foo"
      },
      {
          id: 4,
          content: "Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You. Hi Phil. I Don't Love You.",
          createdAt: "2016-12-10T08:15:58.243Z",
          updatedAt: "2016-12-10T08:15:58.243Z",
          user_id: 5,
          topic_id: 4,
          opinion_id: 2,
          commentAuthor: "Kevin He"
      }
    ];
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
                      'src/assets/' + this.props.viewedTopic.categoryIcon + '.svg'
                    }
                    className="topic-viewer-category-icon"/>
                </div>
                <div className="topic-viewer-category-name">
                  {this.props.viewedTopic.categoryName}
                </div>
              </div>
              <div className="topic-viewer-description">
                This is a description. This is just some text.
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
                className="comment-composer"
                placeholder="Write a comment...">
              </textarea>
              <div className="comment-composer-buttons">
                <div className="comment-composer-post-button unselectable">
                  <div>Post</div>
                </div>
                <div className="comment-composer-cancel-button unselectable">
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
                className="opinion-composer-create-button"
                onClick={this.createOpinion.bind(this)}>
                Create
              </div>
              <div
                className="opinion-composer-cancel-button"
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
