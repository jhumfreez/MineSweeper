import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GameBoard } from './types';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { 
  board: GameBoard;
  defaultSize: number;
  defaultMineCount: number;
  constructor(){
    this.defaultSize = 15;
    this.defaultMineCount = Math.floor(this.defaultSize * .2);
    this.board = new GameBoard(this.defaultSize, );
  }
}
