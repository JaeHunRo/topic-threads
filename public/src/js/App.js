var React = require('react');
var ReactDOM = require('react-dom');
var DiscussionBoard = require('./DiscussionBoard');
var TopicViewer = require('./TopicViewer');
var Color = require('./Color');

const OPINIONS = [
  {
    opinionId: 1,
    topicId: 3,
    voteCount: {},
    userPreviouslyVoted: null,
    author: "Kevin He",
    profilePic: "me.png",
    body: "Personally I think there are a few reasons for this. The first of which is this. I am just writing words to fill this space."
  },
  {
    opinionId: 2,
    topicId: 3,
    voteCount: {
      convincing: 4,
      flawed: 2
    },
    userPreviouslyVoted: null,
    author: "Alex Dao",
    profilePic: "alex.png",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat, elit et commodo accumsan, enim libero efficitur eros, ac sodales magna neque non est. Cras ac tellus mi. Aenean non vestibulum enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat, elit et commodo accumsan, enim libero efficitur eros, ac sodales magna neque non est. Cras ac tellus mi. Aenean non vestibulum enim."
  },
  {
    opinionId: 3,
    topicId: 3,
    voteCount: {
      savage: 1
    },
    userPreviouslyVoted: "savage",
    author: "Jae Hun Ro",
    profilePic: "jae.png",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  },
  {
    opinionId: 4,
    topicId: 3,
    voteCount: {
      convincing: 2,
      debatable: 6
    },
    userPreviouslyVoted: "debatable",
    author: "Phil Foo",
    profilePic: "phil.png",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat, elit et commodo accumsan, enim libero efficitur eros, ac sodales magna neque non est."
  },
]

export class App extends React.Component{
  constructor(props) {
    super(props);
    Color.shuffle();

    window.onresize = () => {
      this.setState({
        dimensions: [window.innerWidth, window.innerHeight]
      });
    }

    this.state = {
      viewedTopic: null,
      viewerExpanded: false,
      dimensions: [window.innerWidth, window.innerHeight],
      opinions: [],
      currentUser: {
        id: 5,
        fb_id: "10210619611520173",
        username: "Kevin He",
        admin: true,
        createdAt: "2016-12-06T05:27:21.777Z",
        updatedAt: "2016-12-06T05:27:21.777Z"
      }
    }
  }

  toggleTopicViewer() {
    this.setState({
      viewerExpanded: !this.state.viewerExpanded
    });
  }

  setViewedTopic(topic) {
    console.log('set topic', topic);
    let opinions = [];
    OPINIONS.forEach((opinion) => {
      if (opinion.topicId == topic.topicId) {
        opinions.push(opinion);
      }
    });
    this.setState({
      viewedTopic: topic,
      opinions: opinions
    });
  }

  render() {
    return (
      <div>
        <div id="overlay">
          <TopicViewer
            opinions={this.state.opinions}
            viewedTopic={this.state.viewedTopic}
            expanded={this.state.viewerExpanded}
            toggleViewer={this.toggleTopicViewer.bind(this)}
            colorUtil={Color}
            currentUser={this.state.currentUser}
            dimensions={this.state.dimensions}/>
        </div>
        <div id="body-container">
          <DiscussionBoard
            setTopic={this.setViewedTopic.bind(this)}
            toggleViewer={this.toggleTopicViewer.bind(this)}
            colorUtil={Color}
            currentUser={this.state.currentUser}
            dimensions={this.state.dimensions}/>
        </div>
      </div>
    );
  }
}

module.exports = App;
