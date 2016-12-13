const React = require('react');
const Util = require('./Util');
const Timestamp = require('./Timestamp');

export class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.info.createdAt != nextProps.info.createdAt;
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
          <Timestamp
            cssClass={"comment-author"}
            message={this.props.info.commentAuthor.split(' ')[0] + " •"}
            creationTime={this.props.info.createdAt}/>
        </div>
      </div>
    );
  }
}

module.exports = Comment;
