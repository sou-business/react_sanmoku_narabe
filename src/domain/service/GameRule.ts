import * as WinnerInfo from '../model/WinnerInfo';
import * as Board from '../model/Board';

export function calculateWinner(squares:Board.Squares) : WinnerInfo.WinnerInfo | null{
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner:squares[a], winnerLine: lines[i]};
    }
  }
  return null;
}

export function isGameFinished(squares: Board.Squares): boolean {
  return calculateWinner(squares) !== null || squares.every(square => square !== null);
}