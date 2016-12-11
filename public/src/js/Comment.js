const React = require('react');

export class Comment extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props.info);

    this.state = {

    }
  }

  render() {
    return (
      <div className="comment">

      </div>
    );
  }
}

module.exports = Comment;
