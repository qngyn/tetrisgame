export default class User {
  score;
  level;
  lines;

  constructor() {
    this.resetUserScoreData();
  }

  resetUserScoreData = () => {
    this.score = 0;
    this.level = 0;
    this.lines = 0;
  };

  setUserScoreData = (key, value) => {
    this[key] = value;
    // show updated data
    displayScoreData(key);
  };

  updateUserScoreData = (key, deltaValue) => {
    this[key] += deltaValue;
    // show updated data
    this.displayScoreData(key, this[key]);
  };

  displayScoreData = (key, value) => {
    let element = document.getElementById(key);
    if (element) {
      element.textContent = value;
    }
  };
}
