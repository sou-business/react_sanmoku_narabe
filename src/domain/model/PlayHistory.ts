import * as Board from './Board';
import * as Position from '../model/Position';

export interface HistoryItem {
  id: number;
  squares: Board.Squares;
  position: Position.NullablePosition;
}

export type History = HistoryItem[];