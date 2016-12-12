const React = require('react');
const DiscussionTopic = require('./DiscussionTopic');
const Util = require('./Util');

const categories = [
  {
    label: 'Sports',
    icon: 'sports.svg'
  },
  {
    label: 'Academics',
    icon: 'academics.svg'
  },
  {
    label: 'Campus Politics',
    icon: 'campus-politics.svg'
  },
  {
    label: 'General',
    icon: 'general.svg'
  },
]
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

    this.state = {
      showButtonLabel: false,
      userProfileShown: false,
      titleValue: '',
      descriptionValue: '',
      categoryValue: {},
      categorySelectorExpanded: false,
      composerShown: false
    }
  }

  mouseEnterLabel() {
    this.setState({
      showButtonLabel: true
    });
  }

  mouseLeaveLabel() {
    this.setState({
      showButtonLabel: false
    });
  }

  toggleUserProfile() {
    this.setState({
      userProfileShown: !this.state.userProfileShown
    });
  }

  handleTitleChange(event) {
    this.setState({
      titleValue: event.target.value
    });
  }

  handleDescriptionChange(event) {
    this.setState({
      descriptionValue: event.target.value
    });
  }

  getTopics() {
    // TODO: retrieve topics on board from database
    return TOPICS;
  }

  boardClicked(event) {
    const target = event.nativeEvent.target;
    let profileIsClicked = target == document.getElementById('user-profile');
    if (!profileIsClicked) {
      let children = document.getElementById('user-profile').children;
      for(let i = 0; i < children.length; i++) {
        if (children[i] == target) {
          profileIsClicked = true;
          break;
        }
      }
    }
    if (!profileIsClicked && this.state.userProfileShown) {
      this.setState({
        userProfileShown: false
      });
    }
  }

  isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  selectCategory(category) {
    this.setState({
      categoryValue: category,
      categorySelectorExpanded: false
    });
  }

  renderSelectedCategory() {
    let selectedContent;
    if (this.isEmpty(this.state.categoryValue)) {
      selectedContent = (
        <div>No category selected</div>
      );
    } else {
      selectedContent = (
        <div className="topic-composer-selected-category-option">
          <img
            className="topic-composer-category-option-icon"
            src={'src/assets/' + this.state.categoryValue.icon} />
          <div className="topic-composer-category-option-label">
            {this.state.categoryValue.label}
          </div>
        </div>
      )
    }
    let selectedElement = (
      <div
        className={
          "topic-composer-selected-category" +
          " topic-composer-category-option"
        }
        onClick={this.toggleCategorySelector.bind(this)}>
        {selectedContent}
        <div className="dropdown-arrow">
          <i className="fa fa-sort-desc" aria-hidden="true"></i>
        </div>
      </div>
    );
    return selectedElement;
  }

  renderCategoryOptions() {
    let categoryElements = [];
    categories.forEach((category, index) => {
      let categoryElement = (
        <div
          key={index + "-category-option"}
          className="topic-composer-category-option"
          onClick={this.selectCategory.bind(this, category)}>
          <img
            className="topic-composer-category-option-icon"
            src={'src/assets/' + category.icon} />
          <div className="topic-composer-category-option-label">
            {category.label}
          </div>
        </div>
      );
      categoryElements.push(categoryElement);
    });
    return categoryElements;
  }

  toggleCategorySelector() {
    this.setState({
      categorySelectorExpanded: !this.state.categorySelectorExpanded
    });
  }

  createTopic() {
    let topic = {
      title: this.state.titleValue,
      description: this.state.descriptionValue,
      category: this.state.categoryValue
    }
    console.log('topic', topic);
    this.toggleTopicComposer();
    this.setState({
      titleValue: '',
      descriptionValue: '',
      categoryValue: {}
    });
  }

  cancelTopic() {
    this.toggleTopicComposer();
    this.setState({
      titleValue: '',
      descriptionValue: '',
      categoryValue: {}
    });
  }

  toggleTopicComposer() {
    this.setState({
      composerShown: !this.state.composerShown
    });
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
    let initial = this.props.currentUser.username.charAt(0);
    return (
      <div onClick={this.boardClicked.bind(this)}>
        <div
          className={
            this.state.composerShown
            ? "topic-composer-container shown"
            : "topic-composer-container"
          }>
          <div className="topic-composer" style={{
            left: (this.props.dimensions[0] - 400)/2 + 'px',
            top: (this.props.dimensions[1] - 540)/2 + 'px'
          }}>
            <div className="topic-composer-header">
              New Topic
            </div>
            <div className="topic-composer-title">
              <div className="topic-composer-label">Topic Title</div>
              <input
                id="new-topic-title"
                className="topic-composer-title-field"
                type="text"
                maxLength="80"
                value={this.state.titleValue}
                onChange={this.handleTitleChange.bind(this)}/>
              <div className="topic-composer-char-limit">
                {this.state.titleValue.length + " / 80"}
              </div>
            </div>
            <div className="topic-composer-description">
              <div className="topic-composer-label">
                Description
              </div>
              <textarea
                id="new-topic-description"
                className="topic-composer-description-field"
                maxLength="300"
                value={this.state.descriptionValue}
                onChange={this.handleDescriptionChange.bind(this)}/>
              <div className="topic-composer-char-limit">
                {this.state.descriptionValue.length + " / 300"}
              </div>
            </div>
            <div className="topic-composer-category">
              <div className="topic-composer-label">
                Topic Category
              </div>
              <div className={
                this.state.categorySelectorExpanded
                ? "topic-composer-category-selector expanded"
                : "topic-composer-category-selector"
              }>
                {this.renderSelectedCategory()}
                <div className="topic-composer-category-field">
                  {this.renderCategoryOptions()}
                </div>
              </div>
            </div>
            <div className="topic-composer-buttons">
              <div
                className="topic-composer-create-button"
                onClick={this.createTopic.bind(this)}>
                Create
              </div>
              <div
                className="topic-composer-cancel-button"
                onClick={this.cancelTopic.bind(this)}>
                Cancel
              </div>
            </div>
          </div>
        </div>
        <div className="board-buttons">
          <div className={
            this.state.showButtonLabel ? "add-topic-label shown" : "add-topic-label"
          }>
            Create new topic
          </div>
          <div
            className="add-topic-button unselectable"
            onMouseEnter={this.mouseEnterLabel.bind(this)}
            onMouseLeave={this.mouseLeaveLabel.bind(this)}
            onClick={this.toggleTopicComposer.bind(this)}>
            <i className="fa fa-plus" aria-hidden="true"></i>
          </div>
          <div
            className="user-profile-button unselectable"
            onClick={this.toggleUserProfile.bind(this)}
            style={{
              backgroundColor: this.props.colorUtil.getColor(this.props.currentUser.id)
            }}>
            <div>{initial}</div>
          </div>
        </div>
        <div id="user-profile" className={
          this.state.userProfileShown ? "user-profile shown" : "user-profile"
        }>
          <div className="user-profile-name">
            {this.props.currentUser.username}
          </div>
          <div className="user-profile-creation">
            {"User since " + Util.getTimeAgo(this.props.currentUser.createdAt)}
          </div>
          <div className="logout unselectable">
            Logout
          </div>
        </div>
        <div id="discussion-board">
          {this.renderTopics()}
        </div>
      </div>
    );
  }
}

module.exports = DiscussionBoard;
