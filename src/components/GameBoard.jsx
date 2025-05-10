import { useEffect, useState } from "react";
import "./gameBoard.css";
import { getSolution } from "../utils/getAvaliableMove";
import sleep from "../utils/sleep";

const createBoard = (size) => {
  return Array(parseInt(size, 10))
    .fill()
    .map(() => Array(size).fill(null));
};

export default function GameBoard() {
  const INIT_POSITION = [0, 0];
  const [boardSize, setBoardSize] = useState(7);
  const [boardState, setBoardState] = useState(() => createBoard(boardSize));
  const [currentBox, setCurrentBox] = useState([0, 0]);
  const solution = getSolution(INIT_POSITION, boardSize, boardState);

  useEffect(() => {
    async function paint() {
      for (const index of solution) {
        const [x, y] = index;
        await sleep(300);
        setBoardState((prev) => {
          const newBoard = prev.map((row) => [...row]);
          newBoard[x][y] = solution.indexOf(index) + 1;
          return newBoard;
        });
        setCurrentBox([x, y]);
      }
    }
    paint();
  }, []);

  return (
    <div>
      <label>
        pick a size for your board:
        <select
          value={boardSize}
          onChange={(e) => setBoardSize(e.target.value)}
        >
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
        </select>
      </label>

      {/* board layout */}
      <section>
        <div className="board-box-wrapper">
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
