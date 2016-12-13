export class TopicFilterOptions {
  static byMostRecent(topics) {
    let list = [];
    topics.forEach((topic) => {
      list.push([topic, (new Date(topic.createdAt)).getTime()]);
    });
    list.sort((a, b) => {
      return b[1] - a[1];
    });
    return list.map((obj) => {
      return obj[0];
    });
  }

  static byMostUpvoted(topics) {
    let list = [];
    topics.forEach((topic) => {
      list.push([topic, topic.upvotes]);
    });
    list.sort((a, b) => {
      return b[1] - a[1];
    });
    return list.map((obj) => {
      return obj[0];
    });
  }
}

module.exports = TopicFilterOptions;
