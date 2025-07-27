import * as Mark from '../model/Mark';

export interface Square {
  value: Mark.Mark;
  onSquareClick: () => void;
  highlightSquare: boolean;
}

export interface MovePosition {
  row: number;
  column : number;
}

export type NullableMovePosition = MovePosition | null;