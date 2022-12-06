const canvas = document.getElementById('board');
const context = canvas.getContext('2d');
import { GameBoard } from './game-board';

// Initialize canvas size
context.canvas.width = NUM_COLUMNS * SIZE_OF_BLOCK;
context.canvas.height = NUM_ROWS * SIZE_OF_BLOCK;

// Scale the tetris blocks
context.scale(SIZE_OF_BLOCK, SIZE_OF_BLOCK);

let board = new GameBoard();

const startGame = () => {
  board.clear();
  console.log('checkpont');
  console.table(board.grid);
};

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);
