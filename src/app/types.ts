import { generateBoard, getRandomInt, isSamePoint } from './utils';

export type neighbors<T> = [T | null, T | null, T | null, T | null];

export interface Point {
  x: number;
  y: number;
}

export class Point implements Point {
  constructor(public x: number, public y: number) {}
}

export enum TileState {
  NEUTRAL,
  FLAGGED,
  REVEALED_RISKY,
  REVEALED_SAFE,
}
// TODO: re-evaluate access modifiers
export interface Tile {
  isMine: boolean;
  isFlagged: boolean;
  revealed: boolean;
  adjacentMineCount: number;
  disabled: boolean;
  neighbors: neighbors<Tile>;
  location: Point;
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
  constructor(public location: Point) {
    this.init();
    this.displayMap = new Map([
      [TileState.NEUTRAL, ''],
      [TileState.FLAGGED, 'F'],
      [TileState.REVEALED_RISKY, 'M'],
      [TileState.REVEALED_SAFE, this.adjacentMineCount + ''],
    ]);
    this.neighbors = [null, null, null, null];
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
    if (!this.revealed && this.isFlagged) {
      return this.displayMap.get(TileState.FLAGGED);
    }
    if (this.revealed && this.isMine) {
      return this.displayMap.get(TileState.REVEALED_RISKY);
    }
    if (this.revealed && !this.isMine) {
      return this.displayMap.get(TileState.REVEALED_SAFE);
    }
    return result;
  }

  assignNeighbors(north: Tile, east: Tile, south: Tile, west: Tile) {
    this.neighbors = [north, east, south, west];
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
    this.discoverTileNeighbors();
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
      if (!this.board[positionX][positionY].isMine) {
        this.board[positionX][positionY].setMine();
      } else {
        // Room for improvement: This is non-optimal (bigger issue) & technically a risk for infinite loop if max were %100 (but then again that would make the game unwinnable. So... *shrug*)
        i++;
      }
    }
    this.markAdjacentMines();
  }

  private markAdjacentMines() {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        // Surely there's a better way lol
        const prevRowValid = row - 1 >= 0;
        const nextRowValid = row + 1 < this.boardSize;
        const prevColValid = col - 1 >= 0;
        const nextColValid = col + 1 < this.boardSize;

        const n = prevRowValid ? this.board[row - 1][col] : null;
        const s = nextRowValid ? this.board[row + 1][col] : null;
        const w = prevColValid ? this.board[row][col - 1] : null;
        const e = nextColValid ? this.board[row][col + 1] : null;
        const ne =
          prevRowValid && nextColValid ? this.board[row - 1][col + 1] : null;
        const se =
          nextRowValid && nextColValid ? this.board[row + 1][col + 1] : null;
        const sw =
          nextRowValid && prevColValid ? this.board[row + 1][col - 1] : null;
        const nw =
          prevRowValid && prevColValid ? this.board[row - 1][col - 1] : null;
        const count = [n, ne, e, se, s, sw, w, nw].filter(
          (t) => t?.isMine
        ).length;
        this.board[row][col].setAdjacentMineCount(count);
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

  private discoverTileNeighbors() {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const prevRowValid = row - 1 >= 0;
        const nextRowValid = row + 1 < this.boardSize;
        const prevColValid = col - 1 >= 0;
        const nextColValid = col + 1 < this.boardSize;

        const n = prevRowValid ? this.board[row - 1][col] : null;
        const s = nextRowValid ? this.board[row + 1][col] : null;
        const w = prevColValid ? this.board[row][col - 1] : null;
        const e = nextColValid ? this.board[row][col + 1] : null;
        this.board[row][col].assignNeighbors(n, e, s, w);
      }
    }
  }

  getTile(position: Point): Tile {
    // TODO: Refactor to remove side-effect dependency
    // return structuredClone(this.board[position.x][position.y]);
    return this.board[position.x][position.y];
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

  revealTile(tilePosition: Point): boolean {
    // FIXME: exits too early
    // this.revealSafeNeighbors(tilePosition);
    return this.board[tilePosition.x][tilePosition.y].reveal();
    // return currentTile.reveal();
  }

  // TODO: [essential feature] Tile has no adjacent mines, reveal all neighboring tiles until mine boundary established.
  // FIXME: Doesn't capture that a tile was already visited, 4x4 of 0 adjacent would result in inf loop! (I think...)
  revealSafeNeighbors(tilePosition: Point, visited: Point[] = []) {
    // TODO: getTile seems a little pointless atm... This could be better.
    const currentTile = this.getTile(tilePosition);
    if (currentTile.adjacentMineCount > 0) {
      return;
    }
    currentTile.reveal();

    for (let neighor of currentTile.neighbors.filter((x) => x)) {
      if (!visited.some((e) => isSamePoint(e, tilePosition))) {
        visited.push(neighor.location);
        this.revealSafeNeighbors(neighor.location, visited);
      }
    }
  }

  // TODO: [auto-play idea] detect spaces adjacent to tile that are revealed to facilitate auto-play
  adjacentOptions(tile: Tile) {}

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
