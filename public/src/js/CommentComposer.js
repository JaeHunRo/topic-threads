var React = require('react');

export class CommentComposer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <div className="comment-composer-container">
        <textarea
          id="comment-composer"
          className="comment-composer"
          placeholder="Write a comment..."
          value={this.props.commentValue}
          onChange={this.props.handleCommentChange}>
        </textarea>
        <div className="comment-composer-buttons">
          <div
            className={
              this.props.commentValue.length == 0
              ? "comment-composer-post-button unselectable disabled"
              : "comment-composer-post-button unselectable"
            }
            onClick={this.props.createComment}>
            <div>
              {
                this.props.postingComment
                ? (
                  <img src="src/assets/loading.gif"/>
                )
                : "Post"
              }
            </div>
          </div>
          <div
            className="comment-composer-cancel-button unselectable"
            onClick={this.props.cancelComment}>
            <div>Clear</div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = CommentComposer;
