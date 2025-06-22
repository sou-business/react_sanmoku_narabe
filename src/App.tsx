import { ReactElement, useState } from "react";

interface MovePosition {
  row: number;
  column : number;
}

interface HistoryItem {
  id: number;
  squares: Squares;
  position: MovePosition | null;
}

interface WinnerInfo {
   winner: string;
   line: number[];
}

interface BoardProps {
  xIsNext: boolean;
  squares: Squares;
  onPlay: (squares: Squares) => void;
}

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
  highlightSquare: boolean;
}

type NullableMovePosition = MovePosition | null;
type History = HistoryItem[];
type Squares = (string | null)[];

export default function Game() {
  const [history, setHistory] = useState<History>([
    { id: 0, squares: Array(9).fill(null), position: null }
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortASC, setSortASC] = useState(true);
  const xIsNext:boolean = currentMove % 2 === 0;
  const currentSquares:Squares = history[currentMove].squares;
  
  function handlePlay(nextSquares:Squares) : void{
    const updateHistory:History = [...history.slice(0, currentMove + 1)];
    if(currentMove !== 0){
      const updatedItem: HistoryItem = {
        ...updateHistory[currentMove],
        position: getMovePosition(history[currentMove - 1].squares, currentSquares)
      };
      updateHistory[currentMove] = updatedItem;
    }
    // 新しい手を追加
    updateHistory.push({
      id: currentMove + 1,
      squares: nextSquares,
      position: null
    });
    setHistory(updateHistory);
    setCurrentMove(updateHistory.length - 1);
  }

  function jumpTo(nextMove: number): void {
    setCurrentMove(nextMove);
  }

  function sortChange(): void {
    setSortASC(!sortASC);
  }

  const sortedHistory:History = sortASC ?  history : history.slice().reverse();
  const moves = sortedHistory.map(historyItem => {
    const move:number = historyItem.id;
    let listItem;
    if(move === currentMove){
      listItem =  'You are at move #' + move;
    } else {
      const description = move === 0 ? 'Go to game start' : 'Go to move #' + move;
      const position = historyItem.position ? <>({historyItem.position.row},{historyItem.position.column})</> : null;
      listItem = 
      <>
        <button onClick={() => jumpTo(move)}>{description}</button>{position}
      </>
    }
    return( 
        <li key={move}>
          {listItem} 
        </li>
      );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol><button onClick={() => sortChange()}>履歴ソート</button></ol>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board(props: BoardProps) : React.JSX.Element {
  function handleClick(index: number) : void {
    if (props.squares[index] || calculateWinner(props.squares)) {
      return;
    }
    const nextSquares = props.squares.slice();
    if(props.xIsNext){
      nextSquares[index] = "X";
    }else{
      nextSquares[index] = "O";
    }
    props.onPlay(nextSquares);
  }

  const ROW_SIZE = 3;
  const COLUMN_SIZE = 3;
  const winnerInfo:WinnerInfo|null = calculateWinner(props.squares);
  let status;
  if (winnerInfo && winnerInfo.winner) {
    status = 'Winner: ' + winnerInfo.winner;
  } else if (props.squares.every(square => square !== null))
    status = 'draw';
  else {
    status = 'Next player: ' + (props.xIsNext ? 'X' : 'O');
  }

  const board: React.JSX.Element[] = [];
  board.push(<div key="status" className="status">{status}</div>);
  for (let row = 0; row < ROW_SIZE; row++) {
    const squaresInRow: React.JSX.Element[] = [];
    for (let column = 0; column < COLUMN_SIZE; column++) {
      const index = row * ROW_SIZE + column;
      const highlightSquare = winnerInfo ? winnerInfo.line.includes(index) : false;
      squaresInRow.push(
        <Square key = {index} 
          value={props.squares[index]} onSquareClick={() => handleClick(index)} highlightSquare = {highlightSquare}
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

function Square(props :SquareProps) : React.JSX.Element{
  return (
    <button className={`square ${props.highlightSquare && "square-hilights"}`} onClick={props.onSquareClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares:Squares) : WinnerInfo | null{
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

function getMovePosition(prevSquares:Squares, currentSquares:Squares)
: MovePosition | null {
  for (let i = 0; i < currentSquares.length; i++) {
    if (prevSquares[i] !== currentSquares[i]) {
      const row:number = Math.floor(i / 3) + 1;
      const column :number = (i % 3) + 1;
      return { row, column};
    }
  }
  return null;
}
