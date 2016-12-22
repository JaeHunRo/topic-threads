const React = require('react');
const DiscussionTopic = require('./DiscussionTopic');
const TopicFilterOptions = require('./TopicFilterOptions');
const Reactions = require('./OpinionReactions');
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
  MostOpinions: {
    filter: TopicFilterOptions.byMostOpinions,
    label: "Most Opinions"
  },
}

const dropdowns = {
  None: -1,
  Options: 0,
  Categories: 1
}

const infoOptions = {
  LikedTopics: 'Upvoted',
  ReactedOpinions: 'Reacted',
  PostedOpinions: 'Opinions',
  PostedComments: 'Comments'
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
      filterOption: filterOptions.MostRecent,
      filterCategory: 'All',
      filterDropdownExpanded: dropdowns.None,
      profileInfoOption: -1,
      profileInfoSection: [],
      fetchingInfoSection: false
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
    }, () => {
      this.selectUserInfoOption(infoOptions.LikedTopics);
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

  handleBoardClick(event) {
    let isChild;
    if (this.state.userProfileShown) {
      isChild = this.containsElement('user-profile', event.target);
      this.setState({
        userProfileShown: isChild
      });
    }
    if (this.state.filterDropdownExpanded != dropdowns.None) {
      switch (this.state.filterDropdownExpanded) {
        case dropdowns.Options:
          isChild = this.containsElement('categories-filter-dropdown', event.target);
          this.setState({
            filterDropdownExpanded: isChild ? dropdowns.Categories : dropdowns.None
          });
          break;
        case dropdowns.Categories:
          isChild = this.containsElement('options-filter-dropdown', event.target);
          this.setState({
            filterDropdownExpanded: isChild ? dropdowns.Options : dropdowns.None
          });
          break;
      }
    }
    if (this.state.categorySelectorExpanded) {
      this.setState({
        categorySelectorExpanded: false
      });
    }
  }

  containsElement(containerId, element) {
    if (element == document.getElementById(containerId) || element.parentElement == document.getElementById(containerId)) {
      return true;
    }
    if (element.parentElement == document.getElementById('page-container')) {
      return false;
    }
    return this.containsElement(containerId, element.parentElement);
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

  filterByCategory(topics) {
    if (this.state.filterCategory != 'All') {
      topics = topics.filter((topic) => {
        return topic.category == this.state.filterCategory;
      });
    }
    return topics;
  }

  renderUserInfoSection() {
    let infoElements = [];
    switch(this.state.profileInfoOption) {
      case infoOptions.LikedTopics:
        let topics = this.props.topics;
        let likedTopics = topics.filter((topic) => {
          return topic.userPreviouslyVoted === true;
        });
        likedTopics.forEach((topic) => {
          const topicElement = (
            <div
              key={topic.id + '-liked-topic'}
              className='user-info-section-item user-liked-topic'
              onClick={this.handleTopicExpand.bind(this, topic)}>
              <div className="user-liked-topic-title">{topic.title}</div>
              <div className="user-liked-topic-metadata">
                <div className="user-liked-topic-upvotes">
                  <i className="fa fa-chevron-circle-up" aria-hidden="true"/>
                  <div>{topic.upvotes}</div>
                </div>
                <div className="user-liked-topic-opinions">
                  <i className="fa fa-comments-o" aria-hidden="true"/>
                  <div>{topic.opinionCount}</div>
                </div>
              </div>
            </div>
          );
          infoElements.push(topicElement);
        });
        this.setState({
          profileInfoSection: infoElements
        });
        break;
      case infoOptions.ReactedOpinions:
        this.setState({
          fetchingInfoSection: true,
          profileInfoSection: []
        });
        const opinionVotesRequest = $.ajax({
          contentType: 'application/json',
          url: 'api/opinion_votes/user',
          type: 'GET',
        });
        $.when(opinionVotesRequest).done((data) => {
          console.log(data);
          let votes = data.opinionVotes.rows;
          votes.forEach((vote) => {
            const topic = this.getTopicById(vote.topic_id);
            let topicTitle;
            if (topic) {
              topicTitle = topic.title;
            }
            const voteElement = (
              <div
                key={vote.topic_id + '-' + vote.opinion_id + '-user-vote'}
                className="user-info-section-item user-reacted-opinion"
                onClick={this.handleTopicExpand.bind(this, topic)}>
                <div className="user-reacted-opinion-reaction">
                  <img src={"src/assets/vote-icons/" + Reactions.reactions[vote.type].icon}/>
                </div>
                <div className="user-reacted-opinion-previews">
                  <div className="user-info-section-opinion-preview">
                    <span>On:&nbsp;</span>
                    <span className="quotation-mark">&ldquo;</span>
                    {vote.opinionContent}
                    <span className="quotation-mark">&rdquo;</span>
                  </div>
                  <div className="user-info-section-topic-preview">
                    <div className="topic-thumbtack"></div>
                    {topicTitle}
                  </div>
                </div>
              </div>
            );
            infoElements.push(voteElement);
          });
          this.setState({
            fetchingInfoSection: false,
            profileInfoSection: infoElements
          });
        });
        break;
      case infoOptions.PostedOpinions:
        this.setState({
          fetchingInfoSection: true,
          profileInfoSection: []
        });
        const opinionsRequest = $.ajax({
          contentType: 'application/json',
          url: 'api/opinion/user',
          type: 'GET',
        });
        $.when(opinionsRequest).done((data) => {
          console.log(data);
          let opinions = data.opinions.rows;
          opinions.forEach((opinion) => {
            const topic = this.getTopicById(opinion.topic_id);
            let topicTitle;
            if (topic) {
              topicTitle = topic.title;
            }
            const opinionElement = (
              <div
                key={opinion.topic_id + '-' + opinion.id + '-user-opinion'}
                className="user-info-section-item"
                onClick={this.handleTopicExpand.bind(this, topic)}>
                <div className="user-info-section-opinion-preview">
                  <span className="quotation-mark">&ldquo;</span>
                  {opinion.content}
                  <span className="quotation-mark">&rdquo;</span>
                </div>
                <div className="user-info-section-topic-preview">
                  <div className="topic-thumbtack"></div>
                  <div>
                    {topicTitle}
                  </div>
                </div>
              </div>
            );
            infoElements.push(opinionElement);
          });
          this.setState({
            fetchingInfoSection: false,
            profileInfoSection: infoElements
          });
        });
        break;
      case infoOptions.PostedComments:
        console.log('posted comments');
        this.setState({
          fetchingInfoSection: true,
          profileInfoSection: []
        });
        const commentsRequest = $.ajax({
          contentType: 'application/json',
          url: '/api/comment/user',
          type: 'GET',
        });
        $.when(commentsRequest).done((data) => {
          console.log(data);
          let comments = data.comments.rows;
          comments.forEach((comment) => {
            const topic = this.getTopicById(comment.topic_id);
            let topicTitle;
            if (topic) {
              topicTitle = topic.title;
            }
            const commentElement = (
              <div
                key={comment.topic_id + '-' + comment.opinion_id + '-' + comment.id + '-user-comment'}
                className="user-info-section-item"
                onClick={this.handleTopicExpand.bind(this, topic)}>
                <div className="user-info-section-opinion-preview">
                  <span className="quotation-mark">&ldquo;</span>
                  {comment.content}
                  <span className="quotation-mark">&rdquo;</span>
                </div>
                <div className="user-info-section-topic-preview">
                  <div className="topic-thumbtack"></div>
                  <div>
                    {topicTitle}
                  </div>
                </div>
              </div>
            );
            infoElements.push(commentElement);
          });
          this.setState({
            fetchingInfoSection: false,
            profileInfoSection: infoElements
          });
        });
        break;
      default:
        break;
    }
  }

  getTopicById(id) {
    const topics = this.props.topics;
    for(let i = 0; i < topics.length; i++) {
      if (topics[i].id == id) {
        return topics[i];
      }
    }
    return null;
  }

  selectUserInfoOption(option) {
    if (option == this.state.profileInfoOption) {
      return;
    }
    this.setState({
      profileInfoOption: option
    }, () => {
      this.renderUserInfoSection();
    });
  }

  renderUserInfoOptions() {
    let optionElements = [];
    Object.keys(infoOptions).forEach((key, index) => {
      const option = (
        <div
          key={index + '-info-option'}
          className={
            this.state.profileInfoOption == infoOptions[key]
            ? "user-profile-info-option unselectable selected"
            : "user-profile-info-option unselectable"
          }
          onClick={this.selectUserInfoOption.bind(this, infoOptions[key])}>
          {infoOptions[key]}
        </div>
      );
      optionElements.push(option);
    });
    return optionElements;
  }

  handleTopicExpand(topic, event) {
    event.stopPropagation();
    let overlay = document.getElementById('overlay');
    overlay.classList.add('topic-expanded');
    if (this.state.userProfileShown) {
      this.setState({
        userProfileShown: false
      });
    }
    this.props.setTopic(topic);
    this.props.toggleViewer();
  }

  renderTopics() {
    let topicElements = [];
    let topics = this.props.topics;
    topics = this.filterByCategory(topics);
    topics = this.state.filterOption.filter(topics);
    topics.forEach((topic, index) => {
      topicElements.push(
        <DiscussionTopic
          key={'topic-' + topic.id}
          topic={topic}
          seenTopics={this.props.seenTopics}
          updateTopic={this.props.updateTopic}
          setTopic={this.props.setTopic}
          toggleViewer={this.props.toggleViewer}
          categories={this.props.categories}
          handleTopicExpand={this.handleTopicExpand.bind(this)}/>
      );
    });
    return topicElements;
  }

  render() {
    let initial = this.props.currentUser ? this.props.currentUser.username.charAt(0) : "?";
    return (
      <div id="page-container" onClick={this.handleBoardClick.bind(this)}>
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
            <div id="options-filter-dropdown" className={
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
            <div id="categories-filter-dropdown" className={
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
            <div
              className="add-topic-button unselectable"
              onMouseEnter={this.mouseEnterLabel.bind(this)}
              onMouseLeave={this.mouseLeaveLabel.bind(this)}
              onClick={this.toggleTopicComposer.bind(this)}>
              <i className="fa fa-plus" aria-hidden="true"></i>
            </div>
            <div className={
              this.state.showButtonLabel ? "add-topic-label shown" : "add-topic-label"
            }>
              Create new topic
            </div>
          </div>
          <div className="board-buttons">
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
          <div className="user-profile-content">
            <div className="user-profile-info">
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
            </div>
            <div className="user-profile-info-selector">
              {this.renderUserInfoOptions()}
            </div>
            <div className="user-profile-info-section">
              {
                this.state.fetchingInfoSection
                ? (
                  <div className="loading-info-section-container">
                    <div className="loading-info-section">
                      <img src="src/assets/loading.gif"/>
                    </div>
                  </div>
                )
                : this.state.profileInfoSection
              }
            </div>
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
            this.filterByCategory(this.props.topics).length == 0 && !this.props.loadingTopics
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
