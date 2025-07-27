import * as Mark from '../model/Mark';
import * as Square from '../model/Square';

export type Squares = Mark.Mark[];

export interface Board {
  xIsNext: boolean;
  squares: Squares;
  onPlay: (squares: Squares) => void;
}

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