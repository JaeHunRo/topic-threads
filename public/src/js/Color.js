let colorMap = {};
let index = 0;
let colors = ["rgb(0,122,255)", "#4CBB17", "#FFC125", "#FF7441"];
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
    console.log(colors);
    console.log(colorMap);
  }
}

module.exports = Color;
