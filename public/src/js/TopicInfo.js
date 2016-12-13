var React = require('react');

export class TopicInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
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
      </div>
    );
  }
}

module.exports = TopicInfo;
