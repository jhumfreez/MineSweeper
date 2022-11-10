import { Tile } from './types';

/**
 * Generate empty 2D game board of height x width
 */
export const generateBoard = (height: number, width: number) => {
  const rows = new Array(height).fill(null);
  for (let i = 0; i < rows.length; i++) {
    rows[i] = new Array(width).fill(null);
    for (let j = 0; j < rows[i].length; j++) {
      rows[i][j] = new Tile();
    }
  }
  return rows;
};

/**
 * Generate random number from 0 to max
 */
export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};
