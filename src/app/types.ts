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
    this.disabled = false;
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
    this.markAdjacentMines();
  }

  private markAdjacentMines() {
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        const prevRValid = r - 1 >= 0;
        const nextRValid = r + 1 < this.boardSize;
        const prevCValid = c - 1 >= 0;
        const nextCValid = c + 1 < this.boardSize;

        const n = prevCValid ? this.board[r][c - 1] : null;
        const ne = prevRValid && nextCValid ? this.board[r - 1][c + 1] : null;
        const e = nextCValid ? this.board[r][c + 1] : null;
        const se = nextRValid && nextCValid ? this.board[r + 1][c + 1] : null;
        const s = prevRValid ? this.board[r - 1][c] : null;
        const sw = nextRValid && prevCValid ? this.board[r + 1][c - 1] : null;
        const w = nextRValid ? this.board[r + 1][c] : null;
        const nw = prevRValid && prevCValid ? this.board[r - 1][c - 1] : null;

        const count = [n, ne, e, se, s, sw, w, nw].filter(
          (t) => t?.isMine
        ).length;
        // if (count > 0) {
        //   console.log(count, [n, e, s, w]);
        // }
        this.board[r][c].adjacentMineCount = count;
      }
    }
  }

  private disableTiles() {
    for (const arr of this.board) {
      for (const tile of arr) {
        tile.disable();
      }
    }
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

  // Tile has no adjacent mines, reveal all neighboring tiles until mine boundary established.
  revealNeighbors(position: Point) {}

  gameOver() {
    this.revealBoard();
    this.disableTiles();
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
