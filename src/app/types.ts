// https://w3c.github.io/uievents/#interface-mouseevent
export enum MouseButton {
  PRIMARY,
  MIDDLE,
  RIGHT,
  BACK,
  FORWARD,
}


export type TileEventType = 'F' | 'X';

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
