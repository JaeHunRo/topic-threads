const React = require('react');

export class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  getTimeAgo() {
    let createdAt = (new Date(this.props.info.createdAt)).getTime();
    let now = (new Date()).getTime();
    let diff = now - createdAt;
    let seconds = Math.floor(diff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    let agoString;
    if (seconds < 60) {
      agoString = seconds;
      agoString += seconds == 1 ? " second" : " seconds";
    } else if (minutes < 60) {
      agoString = minutes;
      agoString += minutes == 1 ? " minute" : " minutes";
    } else if (hours < 24) {
      agoString = hours;
      agoString += hours == 1 ? " hour" : " hours";
    } else {
      agoString = days;
      agoString += days == 1 ? " day" : " days";
    }
    return agoString + " ago";
  }

  render() {
    return (
      <div className="comment">
        <div className="comment-body">
          {this.props.info.content}
        </div>
        <div className="comment-metadata">
          <div className="comment-author-icon" style={{
            backgroundColor: this.props.colorUtil.getColor(this.props.info.user_id)
          }}>
            <div>{this.props.info.commentAuthor.charAt(0)}</div>
          </div>
          <div className="comment-author">
            {this.props.info.commentAuthor + " • " + this.getTimeAgo()}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Comment;
