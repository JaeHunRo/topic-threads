var React = require('react');
var ReactDOM = require('react-dom');
var DiscussionBoard = require('./DiscussionBoard');
var TopicViewer = require('./TopicViewer');
var Color = require('./Color');
var $ = require('jquery');

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
];

let currentUser = null;
let topics = null;

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

const categories = {
  'sports': {
    label: 'Sports',
    icon: 'sports.svg'
  },
  'academic': {
    label: 'Academics',
    icon: 'academics.svg'
  },
  'campus-politics': {
    label: 'Campus Politics',
    icon: 'campus-politics.svg'
  },
  'general': {
    label: 'General',
    icon: 'general.svg'
  },
};

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
      currentUser: null,
      loadingTopics: true,
      topics: [],
      topicPage: 1,
      postingTopic: false,
      loadingOpinions: false,
      postingOpinion: false
    }
  }

  componentDidMount() {
    const currentUserRequest = $.ajax({
      contentType: 'application/json',
      url: 'api/user',
      type: 'GET'
    });

    $.when(currentUserRequest).done((data) => {
      console.log('user', data);
      this.setState({
        currentUser: data
      });
    });

    this.requestTopics();
  }

  updateTopic(topic) {
    for (let i = 0; i < this.state.topics.length; i++) {
      if (this.state.topics[i].id == topic.id) {
        this.state.topics[i].userPreviouslyVoted = topic.userPreviouslyVoted;
        this.state.topics[i].upvotes = topic.upvotes;
        return;
      }
    }
  }

  updateOpinion(opinion) {
    for (let i = 0; i < this.state.opinions.length; i++) {
      if (this.state.opinions[i].id == opinion.id) {
        this.state.opinions[i].userPreviouslyVoted = opinion.userPreviouslyVoted;
        this.state.opinions[i].voteCount = opinion.voteCount;
        return;
      }
    }
  }

  requestTopics(callback) {
    const topicsRequest = $.ajax({
      contentType: 'application/json',
      url: 'api/topic/pageNum/' + this.state.topicPage,
      type: 'GET'
    });

    $.when(topicsRequest).done((data) => {
      console.log(data);
      this.setState({
        topics: data.rows,
        loadingTopics: false,
        postingTopic: false
      }, callback);
    });
  }

  toggleTopicViewer() {
    this.setState({
      viewerExpanded: !this.state.viewerExpanded
    });
  }

  setViewedTopic(topic) {
    console.log('set topic', topic);
    let opinions = [];
    this.setState({
      viewedTopic: topic,
      opinions: [],
      loadingOpinions: true
    }, () => {
      const opinionsRequest = $.ajax({
        contentType: 'application/json',
        url: 'api/opinion/topicId/' + topic.id + '/pageNum/' + this.state.topicPage,
        type: 'GET'
      });

      $.when(opinionsRequest).done((data) => {
        console.log(data);
        this.setState({
          loadingOpinions: false,
          opinions: data.rows
        });
      });
    });
  }

  startLoadingTopicPost(callback) {
    this.setState({
      postingTopic: true
    }, callback);
  }

  cancelLoadingTopicPost() {
    this.setState({
      postingTopic: false
    });
  }

  addNewTopic(callback) {
    console.log('add new topic...');
    this.requestTopics(callback);
  }

  startLoadingOpinionPost(callback) {
    this.setState({
      postingOpinion: true
    }, callback);
  }

  cancelLoadingOpinionPost() {
    this.setState({
      postingOpinion: false
    });
  }

  addNewOpinion(callback) {
    const opinionsRequest = $.ajax({
      contentType: 'application/json',
      url: 'api/opinion/topicId/' + this.state.viewedTopic.id + '/pageNum/' + this.state.topicPage,
      type: 'GET'
    });

    $.when(opinionsRequest).done((data) => {
      console.log(data);
      this.setState({
        loadingOpinions: false,
        opinions: data.rows
      }, callback);
    });
  }

  render() {
    return (
      <div>
        <div id="overlay">
          <TopicViewer
            opinions={this.state.opinions}
            loadingOpinions={this.state.loadingOpinions}
            viewedTopic={this.state.viewedTopic}
            expanded={this.state.viewerExpanded}
            toggleViewer={this.toggleTopicViewer.bind(this)}
            colorUtil={Color}
            currentUser={this.state.currentUser}
            dimensions={this.state.dimensions}
            categories={categories}
            addNewOpinion={this.addNewOpinion.bind(this)}
            startLoading={this.startLoadingOpinionPost.bind(this)}
            cancelLoading={this.cancelLoadingOpinionPost.bind(this)}
            postingOpinion={this.state.postingOpinion}
            topicPage={this.state.topicPage}
            updateOpinion={this.updateOpinion.bind(this)}/>
        </div>
        <div id="body-container">
          <div className={
            this.state.loadingTopics
            ? "topics-loading-container shown"
            : "topics-loading-container"
          }>
            <div className="topics-loading">
              <img src="src/assets/loading.gif"/>
              <div className="topics-loading-label">
                Loading Topics...
              </div>
            </div>
          </div>
          <DiscussionBoard
            setTopic={this.setViewedTopic.bind(this)}
            toggleViewer={this.toggleTopicViewer.bind(this)}
            colorUtil={Color}
            currentUser={this.state.currentUser}
            dimensions={this.state.dimensions}
            topics={this.state.topics}
            updateTopic={this.updateTopic.bind(this)}
            loadingTopics={this.state.loadingTopics}
            postingTopic={this.state.postingTopic}
            addNewTopic={this.addNewTopic.bind(this)}
            startLoading={this.startLoadingTopicPost.bind(this)}
            cancelLoading={this.cancelLoadingTopicPost.bind(this)}
            categories={categories}/>
        </div>
      </div>
    );
  }
}

module.exports = App;
