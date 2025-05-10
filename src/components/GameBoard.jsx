import { useEffect, useState } from "react";
import "./gameBoard.css";
import { getSolution } from "../utils/getAvaliableMove";

const createBoard = (size) => {
  return Array(parseInt(size, 10))
    .fill()
    .map(() => Array(size).fill(null));
};

export default function GameBoard() {
  const [boardSize, setBoardSize] = useState(5);
  const [boardState, setBoardState] = useState(() => createBoard(boardSize));
  const [steps, setSteps] = useState(1);
  console.log(getSolution([0, 0], 5, boardState));
  const solution = getSolution([0, 0], 5, boardState);
  useEffect(() => {
    for (const index of solution) {
      const [x, y] = index;
      setBoardState((prev) => {
        const newBoard = prev.map((row) => [...row]);
        newBoard[x][y] = solution.indexOf(index) + 1;
        return newBoard;
      });
    }
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
                onClick={(e) => {
                  const position = e.target.id.split(",").map(Number);
                  setBoardState((prev) => {
                    const newBoard = prev.map((row) => [...row]);
                    newBoard[position[0]][position[1]] = steps;
                    return newBoard;
                  });
                  setSteps((prev) => (prev += 1));
                }}
                id={[rowIndex, colIndex]}
                className="board-box"
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
