import {
  NUM_COLUMNS,
  NUM_ROWS,
  SIZE_OF_BLOCK,
  BLOCK_COLORS,
  GAME_POINTS,
  MAX_LINES_FOR_EACH_LEVEL,
  LEVEL_SPEED,
} from './constants';
import TetrisBlock from './tetris-block';

export default class GameBoard {
  constructor(curContext, nextContext, user, timer) {
    this.curContext = curContext;
    this.nextContext = nextContext;
    this.curTetrisBlock = new TetrisBlock(this.curContext);
    this.initializeCanvas();
    this.user = user;
    this.timer = timer;
  }

  initializeCanvas = () => {
    // Initialize canvas size
    this.curContext.canvas.width = NUM_COLUMNS * SIZE_OF_BLOCK;
    this.curContext.canvas.height = NUM_ROWS * SIZE_OF_BLOCK;

    // Scale the tetris blocks
    this.curContext.scale(SIZE_OF_BLOCK, SIZE_OF_BLOCK);
  };

  resetBoard = () => {
    this.initializeCanvas();
    this.board = this.getEmptyBoard();
    this.curTetrisBlock = new TetrisBlock(this.curContext);
    this.showNextTetrisBlock();
  };

  getEmptyBoard = () => {
    return Array.from(Array(NUM_ROWS), () => Array(NUM_COLUMNS).fill(0));
  };

  showNextTetrisBlock = () => {
    const { width, height } = this.nextContext.canvas;
    this.nextTetrisBlock = new TetrisBlock(this.nextContext);
    this.nextContext.clearRect(0, 0, width, height);
    this.nextTetrisBlock.draw();
  };

  // draw board with block to canvas
  drawGame = () => {
    this.curTetrisBlock.draw();
    this.drawCurrentGameBoard();
  };

  drawCurrentGameBoard = () => {
    this.board.forEach((row, yCoordinate) => {
      row.forEach((cellVal, xCoordinate) => {
        if (cellVal > 0) {
          // if cell is colored => fill it with color
          this.curContext.fillStyle = BLOCK_COLORS[cellVal];
          this.curContext.fillRect(xCoordinate, yCoordinate, 1, 1);
        }
      });
    });
  };

  performMove = (keyPressed) => {
    switch (keyPressed) {
      case 'Left': // Applicable to IE, Edge
      case 'ArrowLeft':
        // move block left
        return (curTetrisBlock) => ({
          ...curTetrisBlock,
          x: curTetrisBlock.x - 1,
        });
      case 'Right': // Applicable to IE, Edge
      case 'ArrowRight':
        // move block right
        return (curTetrisBlock) => ({
          ...curTetrisBlock,
          x: curTetrisBlock.x + 1,
        });
      case 'Down': // Applicable to IE, Edge
      case 'ArrowDown':
        // move block down
        // add points for soft drop
        return (curTetrisBlock) => ({
          ...curTetrisBlock,
          y: curTetrisBlock.y + 1,
        });
      case 'Up': // Applicable to IE, Edge
      case 'ArrowUp':
        // return (curTetrisBlock) => {
        //   return board.rotateBlock(curTetrisBlock);
        // };
        return (curTetrisBlock) => curTetrisBlock.rotate();
      case ' ':
      case 'Space Bar':
        // hard drop the block
        return (curTetrisBlock) => {
          console.log('check curTetrisBlock: ');
          console.table(curTetrisBlock.shape);
          let movingTetrisBlock = curTetrisBlock;
          while (this.isValidBlock(movingTetrisBlock)) {
            // update user score
            this.user.updateUserScoreData('score', GAME_POINTS.HARD_DROP);
            // kep moving the block down
            this.curTetrisBlock.move(movingTetrisBlock);
            movingTetrisBlock = this.performMove('ArrowDown')(
              this.curTetrisBlock
            );
          }
          return movingTetrisBlock;
        };
    }
  };

  // this function needs to return a promise
  // so that we can wait for it to finish execution in movedCurBlockDown() in index.js
  // and thus, not overwriting curTetrisBlock with the nextTetrisBlock too soon
  moveCurBlockDown = async () => {
    const newTetrisBlock = this.performMove('ArrowDown')(this.curTetrisBlock);
    if (this.isValidBlock(newTetrisBlock)) {
      this.curTetrisBlock.move(newTetrisBlock);
    } else {
      // TODO
      // the tetris block reached the bottom => save it to the game board
      this.saveLastTetrisBlock(this.curTetrisBlock);
      // check if there's any full rows and clear them
      this.clearFullRows();

      // Game over when the curBlock is stuck at the top
      if (this.curTetrisBlock.y === 0) {
        this.currentGameOver();
        return Promise.resolve(false);
      }
      this.curTetrisBlock = this.nextTetrisBlock;
      this.curTetrisBlock.curContext = this.curContext;
      this.showNextTetrisBlock();
    }
    return Promise.resolve(true);
  };

  currentGameOver = () => {
    this.requestId && cancelAnimationFrame(this.requestId);
  };

  // clear a row on the board if it's occupied entirely with tetris blocks
  clearFullRows = () => {
    let numFullRows = 0;

    this.board.forEach((row, yCoordinate) => {
      if (row.every((cellVal) => cellVal > 0)) {
        // if every cell in the row has value > 0 => that row is full
        // so we would want to clear that row by removing it
        this.board.splice(yCoordinate, 1);

        // then we need to add a new row at the top of the board filled with 0s
        const newEmptyRow = Array(NUM_COLUMNS).fill(0);
        this.board.unshift(newEmptyRow);

        numFullRows++;
      }
    });

    if (numFullRows > 0) {
      // update winning points for clearing rows (i.e. lines)
      this.user.updateUserScoreData(
        'score',
        this.calculatePointsForFullRows(numFullRows)
      );
      this.user.updateUserScoreData('lines', numFullRows);

      // if user is over the maximum lines for the current level
      if (this.user.lines >= MAX_LINES_FOR_EACH_LEVEL) {
        this.user.updateUserScoreData('level', 1);
        // reset lines count for the new level
        this.user.updateUserScoreData('lines', -1 * MAX_LINES_FOR_EACH_LEVEL);

        // TODO: increase speed for this level
        this.timer.level = LEVEL_SPEED[this.user.level];
      }
    }
  };

  isValidBlock = (tetrisBlock) => {
    // a block is valid if every cell in the block is in the game board's bounds
    return tetrisBlock.shape.every((row, yDelta) => {
      return row.every((cellVal, xDelta) => {
        // xDelta, yDelta are the coordinates of a cell in the block relative to the block's coordinate
        // the current cell in the tetris block has the coordinate
        // [tetrisBlock.x + xDelta, tetrisBlock.y + yDelta]
        const x = tetrisBlock.x + xDelta;
        const y = tetrisBlock.y + yDelta;
        const isBlankCell = cellVal === 0;
        const isInBounds =
          this.isInsideGameBoard(x, y) && this.isColoredCell(x, y);
        return isBlankCell || isInBounds;
      });
    });
  };

  // save the last tetris block with its color index to the board after it reaches the bottom
  // so that it can be shown in drawCurrentGameBoard()
  saveLastTetrisBlock = (curTetrisBlock) => {
    curTetrisBlock.shape.forEach((row, yDelta) => {
      row.forEach((cellVal, xDelta) => {
        if (cellVal > 0) {
          this.board[yDelta + curTetrisBlock.y][xDelta + curTetrisBlock.x] =
            curTetrisBlock.randomizedColorIdx;
        }
      });
    });
  };

  // check if a cell's coordinates is inside the game board's boundary
  isInsideGameBoard = (x, y) => {
    return x >= 0 && x < NUM_COLUMNS && y <= NUM_ROWS;
  };

  // check if a given cell is colored (i.e. cell value = 0)
  isColoredCell = (x, y) => {
    return this.board && this.board[y] && this.board[y][x] === 0;
  };

  calculatePointsForFullRows = (numRows) => {
    let pointsForFullRows;
    switch (numRows) {
      case 1:
        pointsForFullRows = GAME_POINTS.SINGLE;
        break;
      case 2:
        pointsForFullRows = GAME_POINTS.DOUBLE;
        break;
      case 3:
        pointsForFullRows = GAME_POINTS.TRIPLE;
        break;
      case 4:
        pointsForFullRows = GAME_POINTS.TETRIS;
        break;
    }
    return pointsForFullRows * (this.user.level + 1);
  };
}
