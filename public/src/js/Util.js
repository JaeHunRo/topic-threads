const React = require('react');

export class Util {
  static getTimeAgo(dateString) {
    let createdAt = (new Date(dateString)).getTime();
    let now = (new Date()).getTime();
    let diff = now - createdAt;
    let seconds = Math.floor(diff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    let agoString;
    if (seconds < 60) {
      agoString = seconds >= 0 ? seconds : 0;
      agoString += seconds == 1 ? " second" : " seconds";
    } else if (minutes < 60) {
      agoString = minutes;
      agoString += minutes == 1 ? " minute" : " minutes";
    } else if (hours < 24) {
      agoString = hours;
      agoString += hours == 1 ? " hour" : " hours";
    } else {
      agoString = days;
      agoString += days == 1 ? " day" : " days";
    }
    return agoString + " ago";
  }

  static parseLinkContent(content) {
    let pattern = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    let parts = [];
    let urlIndices = [];
    let index = 0;
    content.replace(pattern, (url) => {
      let urlIndex = content.indexOf(url);
      urlIndices.push(urlIndex);
      parts.push(content.substring(index, urlIndex));
      parts.push(url);
      index = content.indexOf(url) + url.length;
    });
    parts.push(content.substring(index, content.length));
    let elements = [];
    for(let i = 0; i < parts.length; i++) {
      let element;
      if (urlIndices.indexOf(content.indexOf(parts[i])) != -1) {
        // this part is a url
        element = (
          <a key={i+'-opinion-string-index'} target="_blank" className="parsed-content-link" href={parts[i]}>{parts[i]}</a>
        );
      } else {
        element = (
          <span key={i+'-opinion-string-index'} className="opinion-text">{parts[i]}</span>
        );
      }
      elements.push(element);
    }
    return elements;
  }
}

module.exports = Util;
