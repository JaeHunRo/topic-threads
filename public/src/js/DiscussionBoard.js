const React = require('react');
const DiscussionTopic = require('./DiscussionTopic');
const TOPICS = [
  {
    title:'Duke vs. UNC (Men\'s Basketball)',
    categoryIcon:'sports',
    categoryName:'Sports',
    votes: 10,
    opinions: 26,
    topicId: 1
  },
  {
    title:'Fall Semester Bookbagging',
    categoryIcon:'academics',
    categoryName:'Academics',
    votes: 6,
    opinions: 5,
    topicId: 2,
  },
  {
    title:'Microaggressions',
    categoryIcon:'campus-politics',
    categoryName: 'Campus Politics',
    votes: 17,
    opinions: 28,
    topicId: 3,
  },
  {
    title:'Yik Yak has been terrible!',
    categoryIcon:'general',
    categoryName: 'General Discussion',
    votes: 25,
    opinions: 162,
    topicId: 4,
  },
  {
    title:'Our football team has been looking awesome',
    categoryIcon:'sports',
    categoryName:'Sports',
    votes: 1,
    opinions: 1,
    topicId: 5,
  },
  {
    title:'Issues on Campus',
    categoryIcon:'campus-politics',
    categoryName:'Campus Politics',
    votes: 12,
    opinions: 53,
    topicId: 6,
  }
];

export class DiscussionBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  getTopics() {
    // TODO: retrieve topics on board from database
    return TOPICS;
  }

  renderTopics() {
    let topicElements = [];
    let topics = this.getTopics();
    topics.forEach((topic, index) => {
      topicElements.push(
        <DiscussionTopic
          key={'topic-' + index}
          topic={topic}
          setTopic={this.props.setTopic}
          toggleViewer={this.props.toggleViewer}/>
      );
    });
    return topicElements;
  }

  render() {
    return (
      <div id="discussion-board">
        {this.renderTopics()}
      </div>
    );
  }
}

module.exports = DiscussionBoard;
