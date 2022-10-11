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
    this.defaultMineCount = Math.floor(this.defaultSize * 0.2);
    this.board = new GameBoard(this.defaultSize, this.defaultMineCount);
  }

  revealTile(x:number,y:number){
    this.board.revealTile(new Point(x,y));
  }

  reset(){
    this.board.reset();
  }
}
