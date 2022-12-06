export default class User {
  score;
  level;
  lines;

  constructor() {
    this.resetUserScoreData();
  }

  resetUserScoreData = () => {
    ['score', 'level', 'lines'].forEach((key) => this.setUserScoreData(key, 0));
  };

  setUserScoreData = (key, value) => {
    this[key] = value;
    // show updated data
    this.displayScoreData(key, value);
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
