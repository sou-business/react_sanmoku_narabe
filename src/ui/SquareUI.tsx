import * as SquareModel from '../domain/model/Square';

export function SquareUI(propsSquare :SquareModel.Square) : React.JSX.Element{
  return (
    <button className={`square ${propsSquare.highlightSquare && "square-hilights"}`} onClick={propsSquare.onSquareClick}>
      {propsSquare.value}
    </button>
  );
}