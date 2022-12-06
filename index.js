import './styles.css';
import { KEYS, GAME_POINTS } from './constants';
import GameBoard from './game-board';
import User from './user';
import Timer from './timer';

const canvas = document.getElementById('board');
const curContext = canvas.getContext('2d');
const nextContext = canvas.getContext('2d');

const user = new User();
let timer = new Timer(user);
let board = new GameBoard(curContext, nextContext, user, timer);
let requestId;

const instructionModalOverlay = document.getElementById('modal-overlay');
const showInstructionModal = () => {
  instructionModalOverlay.style.display = 'flex';
};
const instructionButton = document.getElementById('instr-button');
instructionButton.addEventListener('click', showInstructionModal);
const closeModalButton = document.getElementById('close-modal');
const closeInstructionModal = () => {
  instructionModalOverlay.style.display = 'none';
};
closeModalButton.addEventListener('click', closeInstructionModal);
const closeInstructionModalOnOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeInstructionModal();
  }
};
instructionModalOverlay.addEventListener(
  'click',
  closeInstructionModalOnOverlayClick
);

const startGame = () => {
  timer.resetTimer(user);
  timer.start = performance.now();
  board.resetBoard();
  board.drawGame();
  let hscore;
  if (board.user.score > board.user.hscore) {
    hscore = board.user.score;
  }
  board.user.resetUserScoreData();
  hscore && board.user.setUserScoreData('hscore', hscore);
  animate();
  pauseButton.disabled = false;
  pauseButton.innerHTML = 'Pause';
};

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);

const animate = async (now = 0) => {
  timer.elapsed = now - timer.start;

  // reached the elapsed time allowed for the current level
  if (timer.elapsed > timer.level) {
    const movedCurBlockDown = await board.moveCurBlockDown();
    timer.start = now;
    if (!movedCurBlockDown) {
      currentGameOver();
      return;
    }
  }
  curContext.clearRect(0, 0, curContext.canvas.width, curContext.canvas.height);
  board.drawGame();
  requestId = requestAnimationFrame(animate);
};

const pauseGame = () => {
  if (!requestId) {
    // resume game
    pauseButton.innerHTML = 'Pause';
    animate();
    return;
  }

  cancelAnimationFrame(requestId);
  requestId = null;

  curContext.fillStyle = '#000000b3';
  curContext.fillRect(0, 0, curContext.canvas.width, curContext.canvas.height);
  curContext.fillStyle = 'black';
  curContext.fillRect(1, 2.6, 8.3, 1.4);
  curContext.font = '1px Audiowide';
  curContext.fillStyle = '#efcfd4';
  curContext.fillText('PAUSE GAME', 1.3, 3.7);
  pauseButton.innerHTML = 'Resume';
};

const pauseButton = document.getElementById('pause-button');
pauseButton.addEventListener('click', pauseGame);

document.addEventListener('keydown', (event) => {
  const keyPressed = event.key;

  if (KEYS.includes(keyPressed)) {
    event.preventDefault();
    const newTetrisBlock = board.performMove(keyPressed)(board.curTetrisBlock);

    if (board.isValidBlock(newTetrisBlock)) {
      if (keyPressed === 'ArrowDown' || keyPressed === 'Down') {
        // update score here, but not in side of performMove because
        // performMove is also reused for auto drop
        user.updateUserScoreData('score', GAME_POINTS.SOFT_DROP);
      }
      board.curTetrisBlock.move(newTetrisBlock);

      // clear the block's old position
      curContext.clearRect(
        0,
        0,
        curContext.canvas.width,
        curContext.canvas.height
      );

      board.curTetrisBlock.draw();
    }
  }
});

const currentGameOver = () => {
  requestId && cancelAnimationFrame(requestId);
  curContext.fillStyle = '#000000b3';
  curContext.fillRect(0, 0, curContext.canvas.width, curContext.canvas.height);
  curContext.fillStyle = '#efcfd4';
  curContext.fillRect(1, 3, 8, 1.4);
  curContext.font = '1px Audiowide';
  curContext.fillStyle = 'black';
  curContext.fillText('GAME OVER!', 1.5, 4);
};
