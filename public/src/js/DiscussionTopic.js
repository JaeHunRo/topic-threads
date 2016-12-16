var React = require('react');
var $ = require('jquery');

export class DiscussionTopic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upvoted: this.props.topic.userPreviouslyVoted === true,
      expanded: false,
      votes: this.props.topic.upvotes,
      opinions: this.props.topic.opinionCount
    }
  }

  handleUpvote() {
    let votes = this.state.upvoted
      ? this.state.votes - 1
      : this.state.votes + 1;
    const nextState = !this.state.upvoted;
    const voteRequest = $.ajax({
      contentType: 'application/json',
      url: '/api/topic_votes/topicId/' + this.props.topic.id,
      type: this.props.topic.userPreviouslyVoted === null ? 'POST' : 'PUT',
      data: JSON.stringify({
        "is_up": nextState
      }),
      dataType: 'json'
    });

    const voteGetRequest = $.ajax({
      contentType: 'application/json',
      url: '/api/topic/' + this.props.topic.id,
      type: 'GET'
    });

    $.when(voteRequest).done((data) => {
      console.log('vote completed', data);
      $.when(voteGetRequest).done((response) => {
        console.log('response vote data', response);
        this.props.updateTopic(response);
      });
    });

    this.setState({
      upvoted: nextState,
      votes: votes
    });
  }

  render() {
    const topic = this.props.topic;
    return (
      <div className="unselectable discussion-topic-container">
        <div
          className="discussion-topic"
          onClick={this.props.handleTopicExpand.bind(this, topic)}>
          <div className="thumbtack"></div>
          <div className={
            this.props.seenTopics.indexOf(topic.id) == -1
            ? "new-discussion-topic-ribbon"
            : "new-discussion-topic-ribbon topic-seen"
          }>
            New
          </div>
          <div className="topic-category">
            <div className="topic-category-icon">
              {
                topic.category != ''
                ? (
                  <img
                    src={'src/assets/' + this.props.categories[topic.category].icon}
                    width={100}
                    height={100}/>
                )
                : (
                  <div style={{
                    width: '100px',
                    height: '100px'
                  }}> ? </div>
                )
              }
            </div>
          </div>
          <div className="topic-title">
            {topic.title}
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
