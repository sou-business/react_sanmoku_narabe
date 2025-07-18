import * as Board from './Board';

export interface HistoryItem {
  id: number;
  squares: Board.Squares;
  position: Board.NullableMovePosition;
}

export type History = HistoryItem[];