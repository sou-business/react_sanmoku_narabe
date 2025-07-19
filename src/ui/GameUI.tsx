import { ReactElement, useState } from "react";
import * as PlayHistory from "../domain/model/PlayHistory"
import * as Board from "../domain/model/Board";
import * as GameService from "../domain/service/GameService";
import { BoardUI } from "./BoardUI";
import { HistoryUI } from "./HistoryUI";

export function GameUI() {
  const [history, setHistory] = useState<PlayHistory.History>([
    { id: 0, squares: Array(9).fill(null), position: null }
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortASC, setSortASC] = useState(true);
  const xIsNext:boolean = currentMove % 2 === 0;
  const currentSquares:Board.Squares = history[currentMove].squares;

  const handlePlay = (nextSquares: Board.Squares) => {
    const result = GameService.createNextPlayState(history, currentMove, nextSquares);
    setHistory(result.updatedHistory);
    setCurrentMove(result.nextMove);
  };

  function sortChange() {
    setSortASC(!sortASC);
  }

  return (
    <div className="game">
      <div className="game-board">
        <BoardUI 
        xIsNext={xIsNext}
        squares={currentSquares}
        onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol><button onClick={() => sortChange()}>履歴ソート</button></ol>
        <ol> <HistoryUI
              currentMove={currentMove}
              history={history}
              sortASC={sortASC}
              setCurrentMove={setCurrentMove}
            />
        </ol>
      </div>
    </div>
  );
}


