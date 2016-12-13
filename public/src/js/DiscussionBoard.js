const React = require('react');
const DiscussionTopic = require('./DiscussionTopic');
const TopicFilterOptions = require('./TopicFilterOptions');
const Util = require('./Util');
const $ = require('jquery');

const filterOptions = {
  MostRecent: {
    filter: TopicFilterOptions.byMostRecent,
    label: "Most Recent"
  },
  MostUpvoted: {
    filter: TopicFilterOptions.byMostUpvoted,
    label: "Most Upvoted"
  },
}

const dropdowns = {
  None: -1,
  Options: 0,
  Categories: 1
}

export class DiscussionBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showButtonLabel: false,
      userProfileShown: false,
      titleValue: '',
      descriptionValue: '',
      categoryValue: '',
      categorySelectorExpanded: false,
      composerShown: false,
      composerError: false,
      filterOption: filterOptions.MostUpvoted,
      filterCategory: 'All',
      filterDropdownExpanded: dropdowns.None
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
    if (this.state.categoryValue == '') {
      selectedContent = (
        <div>No category selected</div>
      );
    } else {
      selectedContent = (
        <div className="topic-composer-selected-category-option">
          <img
            className="topic-composer-category-option-icon"
            src={'src/assets/' + this.props.categories[this.state.categoryValue].icon} />
          <div className="topic-composer-category-option-label">
            {this.props.categories[this.state.categoryValue].label}
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
          <i className={
            this.state.categorySelectorExpanded
            ? "fa fa-sort-asc"
            : "fa fa-sort-desc"
          } aria-hidden="true"></i>
        </div>
      </div>
    );
    return selectedElement;
  }

  renderCategoryOptions() {
    let categoryElements = [];
    Object.keys(this.props.categories).forEach((key, index) => {
      const category = this.props.categories[key];
      let categoryElement = (
        <div
          key={index + "-category-option"}
          className="topic-composer-category-option"
          onClick={this.selectCategory.bind(this, key)}>
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
    if (this.state.titleValue.length == 0 || this.state.categoryValue.length == 0) {
      this.setState({
        composerError: true
      });
      return;
    }
    let topic = {
      "title": this.state.titleValue,
      "description": this.state.descriptionValue,
      "category": this.state.categoryValue
    }
    console.log('topic', topic);
    const topicCreateRequest = $.ajax({
      contentType: 'application/json',
      url: 'api/topic',
      type: 'POST',
      data: JSON.stringify(topic),
      dataType: 'json'
    });

    $.when(topicCreateRequest).done((data) => {
      console.log('response', data);
      this.props.startLoading(() => {
        this.props.addNewTopic(() => {
          this.toggleTopicComposer();
          this.setState({
            titleValue: '',
            descriptionValue: '',
            categoryValue: '',
            composerError: false
          });
        });
      });
    });
  }

  cancelTopic() {
    this.toggleTopicComposer();
    this.setState({
      titleValue: '',
      descriptionValue: '',
      categoryValue: '',
      composerError: false
    });
  }

  toggleTopicComposer() {
    this.setState({
      composerShown: !this.state.composerShown
    });
  }

  selectFilterOption(option, type) {
    if (type == dropdowns.Options) {
      this.setState({
        filterOption: option
      });
    } else if (type == dropdowns.Categories) {
      this.setState({
        filterCategory: option
      });
    }
    this.toggleFilterDropdown(type);
  }

  renderFilterOptions() {
    let optionElements = [];
    Object.keys(filterOptions).forEach((option, index) => {
      const optionElement = (
        <div
          key={index + '-filter-option'}
          className="filter-option"
          onClick={this.selectFilterOption.bind(this, filterOptions[option], dropdowns.Options)}>
          {filterOptions[option].label}
        </div>
      );
      optionElements.push(optionElement);
    });
    return optionElements;
  }

  renderCategoryFilterOptions() {
    let categoryElements = [];
    const allElement = (
      <div
        key={'all-category-filter-option'}
        className="filter-option"
        onClick={this.selectFilterOption.bind(this, 'All', dropdowns.Categories)}>
        All
      </div>
    );
    categoryElements.push(allElement);
    Object.keys(this.props.categories).forEach((category, index) => {
      const categoryElement = (
        <div
          key={index + '-category-filter-option'}
          className="filter-option category-filter-option"
          onClick={this.selectFilterOption.bind(this, category, dropdowns.Categories)}>
          <img src={'src/assets/' + this.props.categories[category].icon}/>
          <div>{this.props.categories[category].label}</div>
        </div>
      );
      categoryElements.push(categoryElement);
    });
    return categoryElements;
  }

  toggleFilterDropdown(type) {
    if (this.state.filterDropdownExpanded == dropdowns.None) {
      this.setState({
        filterDropdownExpanded: type
      });
    } else {
      this.setState({
        filterDropdownExpanded: this.state.filterDropdownExpanded == type ? dropdowns.None : type
      });
    }
  }

  renderTopics() {
    let topicElements = [];
    let topics = this.props.topics;
    if (this.state.filterCategory != 'All') {
      topics = topics.filter((topic) => {
        return topic.category == this.state.filterCategory;
      });
    }
    topics = this.state.filterOption.filter(topics);
    topics.forEach((topic, index) => {
      topicElements.push(
        <DiscussionTopic
          key={'topic-' + topic.id}
          topic={topic}
          updateTopic={this.props.updateTopic}
          setTopic={this.props.setTopic}
          toggleViewer={this.props.toggleViewer}
          categories={this.props.categories}/>
      );
    });
    return topicElements;
  }

  render() {
    let initial = this.props.currentUser ? this.props.currentUser.username.charAt(0) : "?";
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
              <div className={
                this.state.composerError && this.state.titleValue.length == 0
                ? "topic-composer-title-error error shown"
                : "topic-composer-title-error error"
              }>
                Please enter a title for your topic.
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
                placeholder="(Optional)"
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
                <div style={{
                  position: "relative"
                }}>
                  {this.renderSelectedCategory()}
                  <div className={
                    this.state.composerError && this.state.categoryValue.length == 0
                    ? "topic-composer-category-error error shown"
                    : "topic-composer-category-error error"
                  }>
                    Please select a category for your topic.
                  </div>
                </div>
                <div className="topic-composer-category-field">
                  {this.renderCategoryOptions()}
                </div>
              </div>
            </div>
            <div className="topic-composer-buttons">
              <div
                className="topic-composer-create-button"
                onClick={this.createTopic.bind(this)}>
                {
                  this.props.postingTopic == true
                  ? (
                    <img src="src/assets/loading.gif"/>
                  )
                  : "Create"
                }
              </div>
              <div
                className="topic-composer-cancel-button"
                onClick={this.cancelTopic.bind(this)}>
                Cancel
              </div>
            </div>
          </div>
        </div>
        <div className="header-bar">
          <div className="filter-options-container">
            <div className={
              this.state.filterDropdownExpanded == dropdowns.Options
              ? "filter-options-dropdown-container expanded"
              : "filter-options-dropdown-container"
            }>
              <div
                className="filter-options-selected filter-option"
                onClick={this.toggleFilterDropdown.bind(this, dropdowns.Options)}>
                {this.state.filterOption.label}
                <div className="dropdown-arrow">
                  <i className={
                    this.state.filterDropdownExpanded == dropdowns.Options
                    ? "fa fa-sort-asc"
                    : "fa fa-sort-desc"
                  } aria-hidden="true"></i>
                </div>
              </div>
              <div className="filter-options-dropdown">
                {this.renderFilterOptions()}
              </div>
            </div>
            <div className={
              this.state.filterDropdownExpanded == dropdowns.Categories
              ? "filter-options-dropdown-container expanded"
              : "filter-options-dropdown-container"
            }>
              <div
                className="filter-options-selected filter-option"
                onClick={this.toggleFilterDropdown.bind(this, dropdowns.Categories)}>
                {this.state.filterCategory == 'All' ? 'All' : this.props.categories[this.state.filterCategory].label}
                <div className="dropdown-arrow">
                  <i className={
                    this.state.filterDropdownExpanded == dropdowns.Categories
                    ? "fa fa-sort-asc"
                    : "fa fa-sort-desc"
                  } aria-hidden="true"></i>
                </div>
              </div>
              <div className="filter-options-dropdown">
                {this.renderCategoryFilterOptions()}
              </div>
            </div>
          </div>
          <div className="page-title">Topic Threads</div>
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
                backgroundColor: this.props.currentUser ? this.props.colorUtil.getColor(this.props.currentUser.id) : 'black'
              }}>
              <div>{initial}</div>
            </div>
          </div>
        </div>
        <div id="user-profile" className={
          this.state.userProfileShown ? "user-profile shown" : "user-profile"
        }>
          <div className="user-profile-name">
            {
              this.props.currentUser
              ? this.props.currentUser.username
              : "No User Found"
            }
          </div>
          <div className="user-profile-creation">
            {
              this.props.currentUser
              ? "User since " + Util.getTimeAgo(this.props.currentUser.createdAt)
              : "Error"
            }
          </div>
          <a href="/logout">
            <div className="logout unselectable">
              Logout
            </div>
          </a>
        </div>
        <div id="discussion-board" style={{
          height: (this.props.dimensions[1] - 63) + 'px'
        }}>
          {
            this.props.topics.length == 0 && !this.props.loadingTopics
            ? (
              <div className="no-topics-container">
                <div className="no-topics">
                  No Topics Found
                </div>
              </div>
            ) : null
          }
          {this.renderTopics()}
        </div>
      </div>
    );
  }
}

module.exports = DiscussionBoard;
