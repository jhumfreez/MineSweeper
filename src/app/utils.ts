import { Tile } from './game.model';
import { Point } from './types';

/**
 * Generate empty 2D game board of height x width
 */
export const generateBoard = (height: number, width: number, debugMode = false) => {
  const rows = new Array(height).fill(null);
  for (let i = 0; i < rows.length; i++) {
    rows[i] = new Array(width).fill(null);
    for (let j = 0; j < rows[i].length; j++) {
      rows[i][j] = new Tile(new Point(i, j), debugMode);
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

export const isSamePoint = (pointA: Point, pointB: Point) => {
  return pointA.x === pointB.x && pointA.y === pointB.y;
};

export const pointVisited = (tilePosition: Point, visited: Point[]) => visited.some((e) => isSamePoint(e, tilePosition));
