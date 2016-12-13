var React = require('react');
const Util = require('./Util');

export class Timestamp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.creationTime != this.props.creationTime;
  }

  render() {
    return (
      <div className={this.props.cssClass}>
        {this.props.message + ' ' + Util.getTimeAgo(this.props.creationTime)}
      </div>
    );
  }
}

module.exports = Timestamp;
