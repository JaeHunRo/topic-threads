var React = require('react');
const OpinionReactions = require('./OpinionReactions');

export class Timestamp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  renderBreakdownElements() {
    const opinionReactions = OpinionReactions.reactions;
    const reactions = Object.keys(opinionReactions);
    let breakdownElements = [];
    reactions.forEach((reaction, index) => {
      const breakdownElement = (
        <div key={index + "-breakdown-item"} className="reaction-breakdown-item">
          <img src={'src/assets/vote-icons/' + opinionReactions[reaction].icon}/>
          <div>{this.props.voteCount[reaction] ? this.props.voteCount[reaction] : 0}</div>
        </div>
      );
      breakdownElements.push(breakdownElement);
    });
    return breakdownElements;
  }

  render() {
    return (
      <div className="reaction-breakdown">
        {this.renderBreakdownElements()}
      </div>
    );
  }
}

module.exports = Timestamp;
