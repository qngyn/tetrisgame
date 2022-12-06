import { NUM_COLUMNS, NUM_ROWS } from './constants';

// check if a cell's coordinates is inside the game board's boundary
export const isInsideGameBoard = (x, y) => {
  return x >= 0 && x < NUM_COLUMNS && y <= NUM_ROWS;
};

// check if a given cell is colored (i.e. cell value = 0)
export const isColoredCell = (x, y) => {};
