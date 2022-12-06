import { BLOCK_COLORS, BLOCK_SHAPES } from './constants';

export default class TetrisBlock {
  x;
  y;
  color;
  shape;
  context;

  constructor(context) {
    this.context = context;
    this.initialize();
  }

  initialize = () => {
    this.randomizedColorIdx = this.randomizeIndex(BLOCK_COLORS.length - 1);
    this.randomizedShapeIdx = this.randomizeIndex(BLOCK_SHAPES.length - 1);
    this.color = BLOCK_COLORS[this.randomizedColorIdx];
    this.shape = BLOCK_SHAPES[this.randomizedShapeIdx];
    Object.freeze(this.shape);
    // the block's starting coordinates on the board
    // this.x, this.y correspond to the upper left most point in the block
    this.x = this.shape.length === 2 ? 4 : 3;
    this.y = 0;
  };

  draw = () => {
    this.context.fillStyle = this.color;
    this.shape.forEach((row, yDelta) => {
      row.forEach((cellVal, xDelta) => {
        // xDelta, yDelta are the coordinates of a cell in the block relative to the block's coordinate (see comments on this.x, this.y above)
        if (cellVal > 0) {
          // the current cell in the tetris block has the coordinate
          // [this.x + xDelta, this.y + yDelta]
          this.context.fillRect(this.x + xDelta, this.y + yDelta, 1, 1);
        }
      });
    });
  };

  move = (block) => {
    this.x = block.x;
    this.y = block.y;
    this.shape = block.shape;
  };

  rotate = () => {
    // deep copy the current block
    const rotatedBlock = JSON.parse(JSON.stringify(this));
    let rotatedBlockShape = rotatedBlock.shape;
    // rotate the block by using matrix transposition
    rotatedBlock.shape = rotatedBlockShape[0].map((_, colIndex) =>
      rotatedBlockShape.map((row) => row[colIndex])
    );
    // reverse columns
    rotatedBlock.shape.forEach((row) => row.reverse());

    return rotatedBlock;
  };

  randomizeIndex = (numItems) => {
    return Math.floor(Math.random() * numItems + 1);
  };
}
