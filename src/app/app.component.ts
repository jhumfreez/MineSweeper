import { Component } from '@angular/core';
import { GameBoard, Point, TileEventType } from './types';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  board: GameBoard;
  defaultSize: number;
  defaultMineCount: number;
  maxMinePercentage: number;
  highScore: number;

  flagInputMode: boolean;

  constructor() {
    this.defaultSize = 15;
    this.maxMinePercentage = 0.15;
    this.defaultMineCount = Math.floor((this.defaultSize ** 2) * this.maxMinePercentage);
    this.board = new GameBoard(this.defaultSize, this.defaultMineCount);
    
    this.highScore = 0;
    this.flagInputMode = false;
  }

  // TODO: Migrate to directive (for right-click listener approach) or event listener (for key press toggle)
  toggleInputMode(){
    this.flagInputMode = !this.flagInputMode;
  }

  updateScore() {
    this.board.updateScore(1);
  }

  updateHighScore() {
    this.board.updateScore(1);
  }

  // Game over
  kaboom() {
    this.board.gameOver();
    this.highScore = this.board.score > this.highScore ? this.board.score : this.highScore;
  }

  // selectTile(x:number, y:number){
  selectTile(engageTile: [TileEventType, Point]){
    const isFlagEvent = engageTile[0] === 'F';
    const kaboom = this.board.selectTile(engageTile[1], isFlagEvent);
    if (!kaboom) {
      this.updateScore();
    } else {
      this.kaboom();
    }
  }

  // revealTile(x: number, y: number) {
  //   this.board.revealTile(new Point(x, y));
  //   const tile = this.board.getTile(new Point(x, y));
  //   if (!tile.isMine) {
  //     this.updateScore();
  //   } else {
  //     this.kaboom();
  //   }
  // }

  reset() {
    this.board.reset();
    this.flagInputMode = false;
  }
}
