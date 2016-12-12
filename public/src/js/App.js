var React = require('react');
var ReactDOM = require('react-dom');
var DiscussionBoard = require('./DiscussionBoard');
var TopicViewer = require('./TopicViewer');
var Color = require('./Color');
var $ = require('jquery');

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
  'food': {
    label: 'Food',
    icon: 'groceries.svg'
  },
  'event': {
    label: 'Event',
    icon: 'calendar.svg'
  },
  'health': {
    label: 'Health',
    icon: 'heart.svg'
  }
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
