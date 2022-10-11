import { Tile } from './types';

export const generateBoard = (height: number, width: number) => {
  return new Array(height).fill(new Array(width).fill(new Tile()));
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};
