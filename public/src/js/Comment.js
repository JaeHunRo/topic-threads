const React = require('react');
const Util = require('./Util');

export class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
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
            {this.props.info.commentAuthor + " • " + Util.getTimeAgo(this.props.info.createdAt)}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Comment;
