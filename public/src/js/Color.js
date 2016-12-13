let colorMap = {};
let index = 0;
let colors = ["rgb(0,122,255)", "#4CBB17", "#FF7441", "#c6e2ff", "#f08080", "#6E6EA9", "#B86DFF"];
export class Color {
  static getColor(userId) {
    if (colorMap[userId]) {
      return colorMap[userId];
    } else {
      colorMap[userId] = colors[index];
      index = (index + 1) % colors.length;
      return colorMap[userId];
    }
  }

  static shuffle() {
    var array = colors;
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    colors = array;
  }
}

module.exports = Color;
