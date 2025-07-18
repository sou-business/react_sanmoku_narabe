import { useMemo } from 'react';
import * as BoardModel from '../domain/model/Board';
import * as WinnerInfo from '../domain/model/WinnerInfo';
import * as GameRules from '../domain/service/GameRule'
import * as GameService from '../domain/service/GameService'
import * as SquareUI from './SquareUI'

export function BoardUI(propsBoard: BoardModel.Board) : React.JSX.Element {

  const ROW_SIZE = 3;
  const COLUMN_SIZE = 3;
  const winnerInfo:WinnerInfo.WinnerInfo|null = GameRules.calculateWinner(propsBoard.squares);
  const isGameFinished = useMemo(() => 
    GameRules.isGameFinished(propsBoard.squares), 
    [propsBoard.squares]
  );

  const returnBoard: React.JSX.Element[] = [];
  returnBoard.push(
    <div key="status" className="status">
        {GameService.getGameStatus(propsBoard, winnerInfo)}
    </div>
  );
  for (let row = 0; row < ROW_SIZE; row++) {
    const squaresInRow: React.JSX.Element[] = [];
    for (let column = 0; column < COLUMN_SIZE; column++) {
      const index = row * ROW_SIZE + column;
      const highlightSquare = winnerInfo ? winnerInfo.winnerLine.includes(index) : false;
      squaresInRow.push(
        <SquareUI.SquareUI 
          key = {index} 
          value={propsBoard.squares[index]} 
          onSquareClick={() => {
            if (!isGameFinished) {
              BoardModel.placeMark(index, propsBoard);
            }
          }} 
          highlightSquare = {highlightSquare}
        />
      );
    }
    returnBoard.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }
  return <>{returnBoard}</>;
}