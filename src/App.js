import { useState } from "react";
import { useMemo } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [posHistory, setPosHistory] = useState([null]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortASC, setSortASC] = useState(true);
  const xIsnext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    if(currentMove !== 0){
      const nextPosHistory = [...posHistory.slice(0, currentMove + 1), getMovePosition(history[currentMove-1], currentSquares)]
      setPosHistory(nextPosHistory);
    }
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function sortChange() {
    setSortASC(!sortASC);
  }

  const historyWithId = useMemo(() => 
    history.map((squares, index) => ({ 
      id: index,
      pos: posHistory[index],
      squares 
    })),[history]
  );
  const sortedHistory = sortASC ?  historyWithId : historyWithId.slice().reverse();
  const moves = sortedHistory.map(squares => {
    const move = squares.id;
    let listItem;
    if(move === currentMove){
      listItem =  'You are at move #' + move;
    } else {
      const description = move === 0 ? 'Go to game start' : 'Go to move #' + move;
      const pos = squares.pos ? <>({squares.pos.row},{squares.pos.col})</> : null;
      listItem = 
      <>
        <button onClick={() => jumpTo(move)}>{description}</button>{pos}
      </>
    }
    return( 
      <>
        <li key={move}>
          {listItem} 
        </li>
      </>
      );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsnext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol><button onClick={() => sortChange()}>履歴ソート</button></ol>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = "X";
    }else{
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const ROW_SIZE = 3;
  const COLOMUN_SIZE = 3;
  const winnerInfo = calculateWinner(squares);
  let status;
  if (winnerInfo && winnerInfo.winner) {
    status = 'Winner: ' + winnerInfo.winner;
  } else if (squares.every(square => square !== null))
    status = 'draw';
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const board = [];
  board.push(<div key="status" className="status">{status}</div>);
  for (let row = 0; row < ROW_SIZE; row++) {
    const squaresInRow = [];
    for (let column = 0; column < COLOMUN_SIZE; column++) {
      const index = row * ROW_SIZE + column;
      const hilighthSquare = winnerInfo ? winnerInfo.line.includes(index) : false;
      squaresInRow.push(
        <Square key = {index} 
          value={squares[index]} onSquareClick={() => handleClick(index)} hilighthSquare = {hilighthSquare}
        />
      );
    }
    board.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }
  return <>{board}</>;
}

function Square({value, onSquareClick, hilighthSquare}) {
  return (
    <button className={`square ${hilighthSquare && "square-hilights"}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
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
      return {winner:squares[a], line: lines[i]};
    }
  }
  return null;
}

function getMovePosition(prevSquares, currentSquares) {
  for (let i = 0; i < currentSquares.length; i++) {
    if (prevSquares[i] !== currentSquares[i]) {
      // i番目のマスが前と変わっている＝ここに着手があった
      const row = Math.floor(i / 3) + 1;
      const col = (i % 3) + 1;
      return { row, col };
    }
  }
  return null; // 変化なし（ゲーム開始時など）
}