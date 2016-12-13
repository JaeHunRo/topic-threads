var React = require('react');

export class OpinionComposer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <div
        className={
          this.props.composerShown
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
              value={this.props.opinionValue}
              onChange={this.props.handleOpinionChange}
              maxLength="1000">
            </textarea>
            <div className="opinion-composer-char-limit">
              {this.props.opinionValue.length + " / 1000"}
            </div>
          </div>
          <div className="opinion-composer-buttons">
            <div
              className={
                this.props.opinionValue.length == 0
                ? "opinion-composer-create-button unselectable disabled"
                : "opinion-composer-create-button unselectable "
              }
              onClick={this.props.createOpinion}>
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
              onClick={this.props.cancelOpinion}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = OpinionComposer;
