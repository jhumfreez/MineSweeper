import { generateBoard, getRandomInt } from './utils';

export interface Tile {
  isMine: boolean;
  revealed: boolean;
  adjacentMineCount: number;
  reveal();
  setMine();
  reset();
}

export interface GameBoard {
  maxMineCount: number;
  score: number;
  boardSize: number;
  board: Tile[][];
  reveal();
  reset();
  updateScore(value: number);
}

export class Tile implements Tile {
  constructor() {
    this.isMine = false;
    this.revealed = false;
    this.adjacentMineCount = 0;
  }

  reveal() {
    this.revealed = true;
  }

  setMine() {
    this.isMine = true;
  }

  reset() {
    this.isMine = false;
    this.revealed = false;
    this.adjacentMineCount = 0;
  }
}

export class GameBoard implements GameBoard {
  constructor(boardSize = 15, maxMineCount = 8) {
    this.maxMineCount = maxMineCount;
    this.score = 0;
    this.boardSize = boardSize;
    this.initBoard(boardSize);
  }

  private initBoard(boardSize: number) {
    this.board = generateBoard(boardSize, boardSize);
    this.initMines();
  }

  private initMines() {
    // set isMine for random tiles until max is reached
    for(let i = this.maxMineCount; i > 0; i--){
      const positionX = getRandomInt(this.boardSize - 1);
      const positionY = getRandomInt(this.boardSize - 1);
      this.board[positionX][positionY].setMine();
    }
  }

  reveal() {
    for (const arr of this.board) {
      for (const tile of arr) {
        tile.reveal();
      }
    }
  }

  reset() {
    this.score = 0;
    for (const arr of this.board) {
      for (const tile of arr) {
        tile.reset();
      }
    }
  }

  resize(newBoardSize: number) {
    this.boardSize = newBoardSize;
    this.initBoard(newBoardSize);
  }

  updateScore(value: number) {
    this.score += value;
  }
}
