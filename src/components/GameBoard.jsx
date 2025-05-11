import { useEffect, useState } from "react";
import "./gameBoard.css";
import { findAllSolutions } from "../utils/getAvaliableMove";
import sleep from "../utils/sleep";

const createBoard = (size) => {
  return Array(parseInt(size, 10))
    .fill()
    .map(() => Array(size).fill(null));
};

export default function GameBoard() {
  const INIT_POSITION = [0, 0];
  const [boardState, setBoardState] = useState(() => createBoard(7));
  const [currentBox, setCurrentBox] = useState([0, 0]);
  const [startSolve, setStartSolve] = useState(false);
  const [boardSize, setBoardSize] = useState(7);
  const solution = findAllSolutions(INIT_POSITION, boardSize, boardState, 100);
  console.log("solution", solution);
  useEffect(() => {
    async function paint() {
      for (const index of solution[99]) {
        const [x, y] = index;
        // await sleep(300);
        setBoardState((prev) => {
          const newBoard = prev.map((row) => [...row]);
          newBoard[x][y] = solution[99].indexOf(index) + 1;
          return newBoard;
        });
        setCurrentBox([x, y]);
      }
      setStartSolve(false);
    }
    if (startSolve) paint();
  }, [startSolve]);

  return (
    <div>
      <label>
        pick a size for your board:
        <select
          value={boardSize}
          onChange={(e) => {
            setBoardState(() => createBoard(parseInt(e.target.value, 10)));
            setBoardSize(parseInt(e.target.value, 10));
            setCurrentBox([0, 0]);
          }}
        >
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={10}>10</option>
        </select>
      </label>
      <button onClick={() => setStartSolve(true)}>start!</button>
      {/* board layout */}
      <section>
        <div
          className={`board-box-wrapper ${boardSize === 10 ? "ten-grid" : boardSize === 7 ? "seven-grid" : boardSize === 6 ? "six-grid" : "five-grid"}`}
        >
          {boardState.map((rowBoxes, rowIndex) => {
            return rowBoxes.map((eachBox, colIndex) => (
              <div
                id={[rowIndex, colIndex]}
                className={`
                  board-box
                  ${currentBox[0] === rowIndex && currentBox[1] === colIndex ? "active" : ""}
                  ${boardState[rowIndex][colIndex] && "has-value"}`}
                key={rowIndex + colIndex}
              >
                {eachBox}
              </div>
            ));
          })}
        </div>
      </section>
    </div>
  );
}
