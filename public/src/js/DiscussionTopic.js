var React = require('react');

export class DiscussionTopic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upvoted: false,
      expanded: false,
      votes: this.props.topic.votes,
      opinions: this.props.topic.opinions
    }
  }

  handleUpvote() {
    let votes = this.state.upvoted
      ? this.state.votes - 1
      : this.state.votes + 1;
    this.setState({
      upvoted: !this.state.upvoted,
      votes: votes
    });
  }

  handleTopicExpand() {
    let overlay = document.getElementById('overlay');
    overlay.classList.add('topic-expanded');
    this.props.setTopic(this.props.topic);
    this.props.toggleViewer();
  }

  render() {
    return (
      <div className="unselectable discussion-topic-container">
        <div
          className="discussion-topic"
          onClick={this.handleTopicExpand.bind(this)}>
          <div className="thumbtack"></div>
          <div className="topic-category">
            <div className="topic-category-icon">
              <img
                src={'src/assets/' + this.props.topic.categoryIcon + '.svg'}
                width={100}
                height={100}/>
            </div>
          </div>
          <div className="topic-title">
            {this.props.topic.title}
          </div>
        </div>
        <div className="discussion-topic-metadata">
          <span
            className={this.state.upvoted ? 'voter upvoted' : 'voter'}
            onClick={this.handleUpvote.bind(this)}>
            <i className="fa fa-chevron-up" aria-hidden="true"></i>
          </span>
          <span className="discussion-topic-metadata-info">
            <span className="discussion-topic-metadata-item">
              {this.state.votes}&nbsp;
              <span style={{color:'lightblue'}}>
                {' vote' + (this.state.votes != 1 ? 's' : '')}
              </span>
            </span>
            <span className="discussion-topic-metadata-item">|</span>
            <span className="discussion-topic-metadata-item">
              {this.state.opinions}&nbsp;
              <span style={{color:'lightblue'}}>
                {' opinion' + (this.state.opinions != 1 ? 's' : '')}
              </span>
            </span>
          </span>
        </div>
      </div>
    );
  }
}

module.exports = DiscussionTopic;
