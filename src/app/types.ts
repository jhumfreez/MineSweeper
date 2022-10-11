import { generateBoard, getRandomInt } from './utils';

export interface Point {
  x: number;
  y: number;
}

export class Point implements Point {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export interface Tile {
  isMine: boolean;
  revealed: boolean;
  adjacentMineCount: number;
  disabled: boolean;
  disable();
  reveal();
  setMine();
  reset();
}

export interface GameBoard {
  maxMineCount: number;
  score: number;
  boardSize: number;
  board: Tile[][];
  revealBoard();
  reset();
  updateScore(value: number);
}

export class Tile implements Tile {
  constructor() {
    this.isMine = false;
    this.revealed = false;
    this.adjacentMineCount = 0;
    this.disabled = false;
  }

  reveal() {
    this.revealed = true;
    this.disabled = true;
  }

  setMine() {
    this.isMine = true;
  }

  reset() {
    this.isMine = false;
    this.revealed = false;
    this.adjacentMineCount = 0;
  }

  disable() {
    this.disabled = true;
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
    for (let i = this.maxMineCount; i > 0; i--) {
      const positionX = getRandomInt(this.boardSize - 1);
      const positionY = getRandomInt(this.boardSize - 1);
      this.board[positionX][positionY].setMine();
    }
  }

  private markAdjacentMines(){
    
  }

  getTile(position: Point): Tile {
    return Object.assign({}, this.board[position.x][position.y]);
  }

  revealBoard() {
    for (const arr of this.board) {
      for (const tile of arr) {
        tile.reveal();
      }
    }
  }

  revealTile(position: Point) {
    this.board[position.x][position.y].reveal();
  }

  gameOver() {
    for (const arr of this.board) {
      for (const tile of arr) {
        tile.disable();
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
