export const NUM_COLUMNS = 10;
export const NUM_ROWS = 20;
export const SIZE_OF_BLOCK = 30;
export const MAX_LINES_FOR_EACH_LEVEL = 10;

export const KEYS = [
  'ArrowLeft',
  'Left', // Applicable to IE, Edge
  'ArrowRight',
  'Right', // Applicable to IE, Edge
  'ArrowDown',
  'Down', // Applicable to IE, Edge.
  'ArrowUp',
  'Up', // Applicable to IE, Edge
  ' ',
  'Space Bar', // Applicable to IE and older version of Firefox
];

export const BLOCK_SHAPES = [
  [],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 2],
    [2, 2, 2],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [3, 3, 3],
    [0, 0, 3],
  ],
  [
    [4, 0, 0],
    [4, 4, 4],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [5, 5, 5],
    [5, 0, 0],
  ],
  [
    [6, 6],
    [6, 6],
  ],
  [
    [0, 7, 7],
    [7, 7, 0],
    [0, 0, 0],
  ],
  [
    [8, 8, 0],
    [0, 8, 8],
    [0, 0, 0],
  ],
  [
    [0, 9, 0],
    [9, 9, 9],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [10, 10, 10],
    [0, 10, 0],
  ],
  [
    [0, 0, 11, 0],
    [0, 0, 11, 0],
    [0, 0, 11, 0],
    [0, 0, 11, 0],
  ],
];

export const BLOCK_COLORS = [
  '#abdee6', // 0
  '#cbaacb', // 1
  '#ffc8a2', // 2
  '#ffccb6', // 3
  '#f3b0c3', // 4
  '#cee2cb', // 5
  '#f6eac2', // 6
  '#ecd5e3', // 7
  '#ff968a', // 8
  '#ffaea5', // 9
  '#8fcaca', // 10
  '#97c1a9', // 11
];

// Basic points (reference: https://tetris.wiki/Scoring)
export const GAME_POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1, // per cell
  HARD_DROP: 2, // per cell
};
Object.freeze(GAME_POINTS);

// export const GAME_POINTS;

export const LEVEL_SPEED = {
  0: 700,
  1: 675,
  2: 630,
  3: 550,
  4: 470,
  5: 380,
  6: 300,
  7: 220,
  8: 130,
  9: 100,
  10: 80,
  11: 77,
  12: 74,
  13: 70,
  14: 65,
  15: 60,
  16: 50,
  17: 45,
  18: 40,
  19: 30,
  20: 30,
};
