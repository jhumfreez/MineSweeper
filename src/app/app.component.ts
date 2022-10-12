import { Component } from '@angular/core';
import { GameBoard, Point } from './types';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  board: GameBoard;
  defaultSize: number;
  defaultMineCount: number;
  constructor() {
    this.defaultSize = 15;
    this.defaultMineCount = Math.floor((this.defaultSize ** 2) * 0.2);
    this.board = new GameBoard(this.defaultSize, this.defaultMineCount);
  }

  updateScore() {
    this.board.updateScore(1);
  }

  // Game over
  kaboom() {
    this.board.gameOver();
  }

  revealTile(x: number, y: number) {
    this.board.revealTile(new Point(x, y));
    const tile = this.board.getTile(new Point(x, y));
    if (!tile.isMine) {
      this.updateScore();
    } else {
      this.kaboom();
    }
  }

  reset() {
    this.board.reset();
  }
}
