import * as Board from '../model/Board';
import * as Position from '../model/Position';
import * as WinnerInfo from '../model/WinnerInfo';
import * as PlayHistory from "../model/PlayHistory"

export function getGameStatus(board: Board.Board, winnerInfo: WinnerInfo.WinnerInfo | null): string{
    let status;
      if (winnerInfo && winnerInfo.winner) {
        status = 'Winner: ' + winnerInfo.winner;
      } else if (board.squares.every(square => square !== null))
        status = 'draw';
      else {
        status = 'Next player: ' + (board.xIsNext ? 'X' : 'O');
      }
      return status;
}

export function createNextPlayState(
  history: PlayHistory.History,
  currentMove: number,
  nextSquares: Board.Squares
): { updatedHistory: PlayHistory.History, nextMove: number } {
  const playHistory:PlayHistory.History = [...history.slice(0, currentMove + 1)];

  if (currentMove !== 0) {
    const updatedItem: PlayHistory.HistoryItem = {
      ...playHistory[currentMove],
      position: getMovePosition(history[currentMove - 1].squares, history[currentMove].squares)
    };
    playHistory[currentMove] = updatedItem;
  }

  playHistory.push({
    id: currentMove + 1,
    squares: nextSquares,
    position: null
  });

  return {
    updatedHistory: playHistory,
    nextMove: playHistory.length - 1
  };
}

export function getMovePosition(prevSquares:Board.Squares, currentSquares:Board.Squares): Position.NullablePosition {
  for (let i = 0; i < currentSquares.length; i++) {
    if (prevSquares[i] !== currentSquares[i]) {
      const row:number = Math.floor(i / 3) + 1;
      const column :number = (i % 3) + 1;
      return { row, column};
    }
  }
  return null;
}