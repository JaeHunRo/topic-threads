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
      agoString = seconds;
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
}

module.exports = Util;
