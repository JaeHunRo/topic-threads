const React = require('react');
const $ = require('jquery');
const Util = require('./Util');
const Timestamp = require('./Timestamp');
const Reactions = require('./OpinionReactions');
const ReactionBreakdown = require('./ReactionBreakdown');

const maxReactors = 10;

export class OpinionPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      optionIndex: -1,
      voteOverlayShown: false,
      reactionsShown: false,
      reactors: null
    }
  }

  componentDidMount() {
    this.fetchReactors();
  }

  fetchReactors() {
    const reactorsRequest = $.ajax({
      contentType: 'application/json',
      url: 'api/opinion_votes/topicId/' + this.props.info.topic_id + '/opinionId/' + this.props.info.id,
      type: 'GET'
    });

    $.when(reactorsRequest).done((data) => {
      console.log('reactors', data);
      this.setState({
        reactors: data.rows
      });
    });
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
    || nextProps.info.voteCount != this.props.info.voteCount
    || nextProps.updatingVote != this.props.updatingVote;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updatingVote !== this.props.info.id && this.props.updatingVote === this.props.info.id) {
      console.log('fetch reactors');
      this.fetchReactors();
    }
  }

  selectVoteOption(key, event) {
    this.setState({
      reactors: null
    });
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

    let reactorElements;
    if (this.state.reactors !== null) {
      reactorElements = [];
      for(let i = 0; i < Math.min(this.state.reactors.length, maxReactors); i++) {
        console.log('icon', voteOptions[this.state.reactors[i].type].icon);
        let reactorElement = (
          <div key={this.state.reactors[i].id+'-reactor'} className="reactor">
            <div className="reactor-reaction">
              <img src={"src/assets/vote-icons/" + voteOptions[this.state.reactors[i].type].icon}/>
            </div>
            <div className="reactor-name">{this.state.reactors[i].username.split(' ')[0]}</div>
          </div>
        );
        reactorElements.push(reactorElement);
      }

      if (this.state.reactors.length > maxReactors) {
        reactorElements.push(
          <div key={this.props.info.id+'-more-reactors'} className="reactor-name">
            {'And ' + (this.state.reactors.length - maxReactors) + ' more...'}
          </div>
        )
      }
    }

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
          <div className="reactor-names">
          {
            this.state.reactors
            ? reactorElements
            : <div className="loading-indicator"><img src="src/assets/loading.gif"/></div>
          }
          </div>
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
