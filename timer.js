import { LEVEL_SPEED } from './constants';

// class to control the timer between each frame
// i.e. to control the speed of the moving block
export default class Timer {
  constructor(user) {
    this.resetTimer(user);
  }

  resetTimer = (user) => {
    this.start = 0;
    this.elapsed = 0;
    this.level = LEVEL_SPEED[user.level];
  };
}
