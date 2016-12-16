const React = require('react');
const Util = require('./Util');
const Timestamp = require('./Timestamp');
const Reactions = require('./OpinionReactions');
const ReactionBreakdown = require('./ReactionBreakdown');

export class OpinionPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      optionIndex: -1,
      voteOverlayShown: false,
      reactionsShown: false
    }
  }

  mouseEnterOption(index) {
    this.setState({
      optionIndex: index
    });
  }

  mouseLeaveOption() {
    this.setState({
      optionIndex: -1
    });
  }

  mouseEnterCount() {
    this.setState({
      reactionsShown: true
    });
  }

  mouseLeaveCount() {
    this.setState({
      reactionsShown: false
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.optionIndex != this.state.optionIndex
    || nextState.reactionsShown != this.state.reactionsShown
    || nextState.voteOverlayShown != this.state.voteOverlayShown
    || nextProps.info.userPreviouslyVoted != this.props.userPreviouslyVoted
    || nextProps.info.voteCount != this.props.info.voteCount;
  }

  selectVoteOption(key, event) {
    this.props.selectOpinionVote(key, this.props.info.id);
    this.toggleOverlay(event);
  }

  toggleOverlay(event) {
    event.stopPropagation();
    this.setState({
      voteOverlayShown: !this.state.voteOverlayShown,
      reactionsShown: false
    });
  }

  renderVoteOptions() {
    let voteOptionElements = [];
    let options = [];
    const voteOptions = Reactions.reactions;
    Object.keys(voteOptions).forEach((key) => {
      if (voteOptions.hasOwnProperty(key)) {
        options.push(voteOptions[key]);
      }
    });

    options.forEach((option, index) => {
      let voteOption = (
        <div
          key={index + "-vote-option"}
          className={
            index == this.state.optionIndex
            ? "opinion-vote-option hovered"
            : "opinion-vote-option"
          }
          onClick={this.selectVoteOption.bind(this, option.key)}
          onMouseEnter={this.mouseEnterOption.bind(this, index)}
          onMouseLeave={this.mouseLeaveOption.bind(this)}>
          <div className="opinion-vote-option-label">
            {option.label}
          </div>
          <img
            className="opinion-vote-option-icon"
            src={'src/assets/vote-icons/' + option.icon}/>
        </div>
      );
      voteOptionElements.push(voteOption);
    });
    return voteOptionElements;
  }

  selectOpinion() {
    if (this.state.voteOverlayShown) {
      return;
    }
    this.props.viewCommentList(this.props.info);
  }

  renderVoteCount() {
    const voteCount = this.props.info.voteCount;
    const voteOptions = Reactions.reactions;

    if (Object.keys(voteCount).length == 0) {
      return (
        <div
          className="opinion-vote-count"
          onClick={this.toggleOverlay.bind(this)}>
          No reactions.
        </div>
      );
    }

    let sortedVoteCount = [];
    for (let vote in voteCount) {
      if (voteCount.hasOwnProperty(vote) && voteCount[vote] > 0) {
          sortedVoteCount.push([vote, voteCount[vote]]);
      }
    }
    sortedVoteCount.sort((a, b) => {
      return b[1] - a[1];
    });

    let voteElements = [];
    const length = Math.min(3, sortedVoteCount.length);
    let totalVoteCount = 0;
    for(let i = 0; i < sortedVoteCount.length; i++) {
      totalVoteCount += sortedVoteCount[i][1];
    }

    if (totalVoteCount == 0) {
      return (
        <div
          className="opinion-vote-count"
          onClick={this.toggleOverlay.bind(this)}>
          No reactions.
        </div>
      );
    }

    for(let i = 0; i < length; i++) {
      let voteElement = (
        <div
          key={i + "-count-icon"}
          className="opinion-vote-count-icon">
          <img src={"src/assets/vote-icons/" + voteOptions[sortedVoteCount[i][0]].icon}/>
        </div>
      );
      voteElements.push(voteElement);
    }

    const reactionsLabel = totalVoteCount > 1 ? " reactions." : " reaction.";

    return (
      <div>
        <div
          className="opinion-vote-count"
          onClick={this.toggleOverlay.bind(this)}
          onMouseEnter={this.mouseEnterCount.bind(this)}
          onMouseLeave={this.mouseLeaveCount.bind(this)}>
          {voteElements}
          <div className="reaction-count">
            {totalVoteCount + reactionsLabel}
          </div>
        </div>
        <div className={
          this.state.reactionsShown
          ? "reaction-breakdown-container shown"
          : "reaction-breakdown-container"
        }>
          <div className="arrow-up"></div>
          <ReactionBreakdown voteCount={voteCount}/>
        </div>
      </div>
    );
  }

  renderUserVote() {
    const voteOptions = Reactions.reactions;
    if (this.props.info.userPreviouslyVoted == null) {
      return null;
    } else {
      return (
        <img src={"src/assets/vote-icons/" + voteOptions[this.props.info.userPreviouslyVoted].icon}/>
      );
    }
  }

  render() {
    return (
      <div
        className={
          this.state.voteOverlayShown
          ? "topic-opinion unselectable show-overlay"
          : "topic-opinion unselectable"
        }
        onClick={this.selectOpinion.bind(this)}>
        <div className="user-vote">
          {this.renderUserVote()}
        </div>
        <div className="topic-opinion-info">
          <div className="topic-opinion-author-icon" style={{
            backgroundColor: this.props.colorUtil.getColor(this.props.info.user_id)
          }}>
            <div>{this.props.info.opinionAuthor.charAt(0)}</div>
          </div>
          <div className="topic-opinion-metadata">
            <div className="topic-opinion-author-name">
              {this.props.info.opinionAuthor.split(' ')[0]}
            </div>
            <div className="opinion-vote-count-container">
              {this.renderVoteCount()}
            </div>
          </div>
        </div>
        <div className="topic-opinion-footer">
          <div className="topic-opinion-comment-count">
            {this.props.info.commentCount}
            &nbsp;
            <span>{this.props.info.commentCount == 1 ? ' comment ' : ' comments '}</span>
            &nbsp; •
          </div>
          <Timestamp
            message={null}
            cssClass={"topic-opinion-timestamp"}
            creationTime={this.props.info.createdAt}/>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "center",
          width: "100%"
        }}>
          <div className="topic-opinion-preview-container">
            <div className="topic-opinion-preview">
              {this.props.info.content}
              <div className="preview-fade"/>
            </div>
          </div>
        </div>
        <div
          className="topic-opinion-vote-overlay"
          onClick={this.toggleOverlay.bind(this)}>
          <div className="opinion-vote-container">
            {this.renderVoteOptions()}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = OpinionPreview;
