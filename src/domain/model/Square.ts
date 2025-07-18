import * as Mark from '../model/Mark';

export interface Square {
  value: Mark.Mark;
  onSquareClick: () => void;
  highlightSquare: boolean;
}