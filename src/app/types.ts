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

export enum TileState {
  NEUTRAL,
  FLAGGED,
  REVEALED_RISKY,
  REVEALED_SAFE,
}

export interface Tile {
  isMine: boolean;
  isFlagged: boolean;
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
  displayMap: Map<TileState, unknown>;
  constructor() {
    this.init();
    this.displayMap = new Map([
      [TileState.NEUTRAL, ''],
      [TileState.FLAGGED, 'F'],
      [TileState.REVEALED_RISKY, 'M'],
      [TileState.REVEALED_SAFE, this.adjacentMineCount + ''],
    ]);
  }

  private init() {
    this.isMine = false;
    this.isFlagged = false;
    this.revealed = false;
    this.adjacentMineCount = 0;
    this.disabled = false;
  }

  /**
   * Display values:
   * - [default]: untouched/neutral
   * - F: flagged
   * - M: mine
   * - [number]: adjacent mine count
   */
  get displayValue() {
    let result = this.displayMap.get(TileState.NEUTRAL);
    if(!this.revealed && this.isFlagged){
      return this.displayMap.get(TileState.FLAGGED);
    }
    if(this.revealed && this.isMine){
      return this.displayMap.get(TileState.REVEALED_RISKY);
    }
    if(this.revealed && !this.isMine){
      return this.displayMap.get(TileState.REVEALED_SAFE);
    }
    return result;
  }

  reveal(): boolean {
    this.revealed = true;
    this.disabled = true;
    return this.isMine;
  }

  toggleFlag() {
    this.isFlagged = !this.isFlagged;
  }

  setMine() {
    this.isMine = true;
  }

  setAdjacentMineCount(count: number) {
    this.adjacentMineCount = count;
    this.displayMap.set(TileState.REVEALED_SAFE, count > 0 ? count + '' : '');
  }

  reset() {
    this.init();
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

  // For debug purposes
  get realMineCount() {
    let count = 0;
    for (const row of this.board) {
      count += row.filter((t) => t.isMine).length;
    }
    return !isNaN(count) ? count : 0;
  }

  get tileCount() {
    return this.boardSize ** 2;
  }

  get percentMined() {
    return +(this.realMineCount / this.tileCount).toFixed(2) * 100;
  }

  private initBoard(boardSize: number) {
    this.board = generateBoard(boardSize, boardSize);
    this.initMines();
  }

  private initMines() {
    // set isMine for random tiles until max is reached
    // TODO: Refactor to reduce loops when space is already occupied
    for (let i = this.maxMineCount; i > 0; i--) {
      const positionX = getRandomInt(this.boardSize - 1);
      const positionY = getRandomInt(this.boardSize - 1);
      if(!this.board[positionX][positionY].isMine){
        this.board[positionX][positionY].setMine();
      } else {
        // Room for improvement: This is non-optimal (bigger issue) & technically a risk for infinite loop if max were %100 (but then again that would make the game unwinnable. So... *shrug*)
        i++;
      }
    }
    this.markAdjacentMines();
  }

  private markAdjacentMines() {
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        // Surely there's a better way lol
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
        this.board[r][c].setAdjacentMineCount(count);
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

  /**
   * @returns kaboom occurred
   */
  selectTile(position: Point, flagMode = false): boolean {
    if (flagMode) {
      this.board[position.x][position.y].toggleFlag();
      return false;
    }
    return this.revealTile(position);
  }

  revealTile(position: Point): boolean {
    return this.board[position.x][position.y].reveal();
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
    this.initMines();
  }

  resize(newBoardSize: number) {
    this.boardSize = newBoardSize;
    this.initBoard(newBoardSize);
  }

  // TODO: Score from timer
  updateScore(value: number) {
    this.score += value;
  }
}
