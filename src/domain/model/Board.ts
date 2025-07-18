import * as Mark from '../model/Mark';

export type Squares = Mark.Mark[];

export interface Board {
  xIsNext: boolean;
  squares: Squares;
  onPlay: (squares: Squares) => void;
}

export interface MovePosition {
  row: number;
  column : number;
}

export type NullableMovePosition = MovePosition | null;

export function placeMark(index: number, board: Board) : void {
    if (board.squares[index]) {
        return;
    }
    const nextSquares = board.squares.slice();
    if(board.xIsNext){
        nextSquares[index] = "X";
    }else{
        nextSquares[index] = "O";
    }
    board.onPlay(nextSquares);
}

export function getMovePosition(prevSquares:Squares, currentSquares:Squares): NullableMovePosition {
  for (let i = 0; i < currentSquares.length; i++) {
    if (prevSquares[i] !== currentSquares[i]) {
      const row:number = Math.floor(i / 3) + 1;
      const column :number = (i % 3) + 1;
      return { row, column};
    }
  }
  return null;
}