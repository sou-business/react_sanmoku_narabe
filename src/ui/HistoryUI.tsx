import * as PlayHistory from "../domain/model/PlayHistory"
import React from 'react';

export interface HistoryUIProps {
  currentMove: number;
  history: PlayHistory.History;
  sortASC: boolean;
  setCurrentMove: (move: number) => void;
};

export function HistoryUI (
  historyUIProps : HistoryUIProps
) : React.JSX.Element {
    const history = historyUIProps.history;
    const sortedHistory:PlayHistory.History = historyUIProps.sortASC ?  history : history.slice().reverse();
    const moves = sortedHistory.map(historyItem => {
      const move:number = historyItem.id;
      let listItem;
      if(move === historyUIProps.currentMove){
        listItem =  'You are at move #' + move;
      } else {
        const description = move === 0 ? 'Go to game start' : 'Go to move #' + move;
        const position = historyItem.position ? <>({historyItem.position.row},{historyItem.position.column})</> : null;
        listItem = 
        <>
          <button onClick={() => historyUIProps.setCurrentMove(move)}>{description}</button>{position}
        </>
      }
      return( 
          <li key={move}>
            {listItem} 
          </li>
        );
    });

    return <>{moves}</>;
}