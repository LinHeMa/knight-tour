import React, { useEffect, useMemo, useState, useRef } from "react";
import "./gameBoard.css";
import { findAllSolutions, pathToString } from "../utils/getAvaliableMove";
import sleep from "../utils/sleep";

const createBoard = (solutionCount, size) => {
  return Array(parseInt(solutionCount, 10))
    .fill()
    .map(() =>
      Array(size)
        .fill()
        .map(() => Array(size).fill(null)),
    );
};

const createEmptyBoard = (size) => {
  return Array(size)
    .fill()
    .map(() => Array(size).fill(null));
};

export default function GameBoard() {
  const INIT_POSITION = [0, 0];
  const MAX_SOLUTIONS = 100;
  const [boardSize, setBoardSize] = useState(7);
  const [boardState, setBoardState] = useState(() =>
    createBoard(MAX_SOLUTIONS, boardSize),
  );
  const [currentBox, setCurrentBox] = useState([0, 0]);
  const [startSolveIndex, setStartSolveIndex] = useState(null);
  const [pathLinesMap, setPathLinesMap] = useState({});
  const boardRefs = useRef(Array(MAX_SOLUTIONS).fill().map(() => React.createRef()));
  const [visualizedSolutions, setVisualizedSolutions] = useState([]);

  // useMemo to avoid extra calculation
  const solutions = useMemo(
    () => findAllSolutions(INIT_POSITION, boardSize, createEmptyBoard(boardSize), MAX_SOLUTIONS),
    [boardSize],
  );
  
  // Function to calculate and draw path lines
  const drawPathLine = (boardIndex, fromPos, toPos) => {
    if (!boardRefs.current[boardIndex]?.current) return;
    
    const boardElement = boardRefs.current[boardIndex].current;
    const cellSize = 64; // 60px + 4px margin
    
    // Calculate center positions
    const fromX = fromPos[0] * cellSize + cellSize / 2;
    const fromY = fromPos[1] * cellSize + cellSize / 2;
    const toX = toPos[0] * cellSize + cellSize / 2;
    const toY = toPos[1] * cellSize + cellSize / 2;
    
    // Calculate line length and angle
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    
    // Create a new line element
    const line = document.createElement('div');
    line.className = 'path-line';
    line.style.width = `${length}px`;
    line.style.left = `${fromX}px`;
    line.style.top = `${fromY}px`;
    line.style.transform = `rotate(${angle}deg)`;
    
    // Add to board
    boardElement.appendChild(line);
    
    // Keep track of lines per solution
    setPathLinesMap(prev => {
      const solutionLines = prev[boardIndex] || [];
      return {
        ...prev,
        [boardIndex]: [...solutionLines, line]
      };
    });
    
    // Make it visible after a small delay for animation
    setTimeout(() => {
      line.classList.add('visible');
    }, 50);
    
    return line;
  };
  
  // Clear path lines for a specific solution
  const clearPathLinesForSolution = (solutionIndex) => {
    const lines = pathLinesMap[solutionIndex] || [];
    lines.forEach(line => {
      if (line && line.parentNode) {
        line.parentNode.removeChild(line);
      }
    });
    
    setPathLinesMap(prev => {
      const newMap = {...prev};
      delete newMap[solutionIndex];
      return newMap;
    });
  };
  
  // Clear all path lines (e.g., when changing board size)
  const clearAllPathLines = () => {
    Object.values(pathLinesMap).forEach(lines => {
      lines.forEach(line => {
        if (line && line.parentNode) {
          line.parentNode.removeChild(line);
        }
      });
    });
    setPathLinesMap({});
    setVisualizedSolutions([]);
  };

  useEffect(() => {
    async function paint() {
      if (!solutions || !solutions[startSolveIndex]) {
        console.error("No solution found at index:", startSolveIndex);
        setStartSolveIndex(null);
        return;
      }

      const solution = solutions[startSolveIndex];
      // Reset the board first
      setBoardState((prev) => {
        const newBoards = [...prev];
        newBoards[startSolveIndex] = Array(boardSize)
          .fill()
          .map(() => Array(boardSize).fill(null));
        return newBoards;
      });
      
      // Only clear path lines for the current solution
      clearPathLinesForSolution(startSolveIndex);

      // Paint each step of the solution
      let prevPosition = null;
      
      for (let i = 0; i < solution.length; i++) {
        const [x, y] = solution[i];
        await sleep(300);
        
        setBoardState((prev) => {
          const newBoards = [...prev];
          // Create a copy of the specific board we're modifying
          newBoards[startSolveIndex] = prev[startSolveIndex].map((row) => [
            ...row,
          ]);
          newBoards[startSolveIndex][y][x] = i + 1;
          return newBoards;
        });
        
        setCurrentBox([x, y]);
        
        // Draw connecting line between moves
        if (prevPosition) {
          drawPathLine(startSolveIndex, prevPosition, [x, y]);
        }
        
        prevPosition = [x, y];
      }
      
      // Add this solution to visualized solutions
      setVisualizedSolutions(prev => {
        if (!prev.includes(startSolveIndex)) {
          return [...prev, startSolveIndex];
        }
        return prev;
      });
      
      // Wait for animations to finish
      await sleep(1000);
      setStartSolveIndex(null);
    }

    if (startSolveIndex !== null) {
      paint();
    }
  }, [startSolveIndex, boardSize, solutions]);

  return (
    <div>
      <header style={{ marginBottom: '20px' }}>
        <h1>Knight's Tour Visualizer</h1>
        <label>
          Select board size:
          <select
            value={boardSize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value, 10);
              setBoardSize(newSize);
              setBoardState(createBoard(MAX_SOLUTIONS, newSize));
              setCurrentBox([0, 0]);
              setStartSolveIndex(null);
              clearAllPathLines();
            }}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value={5}>5×5</option>
            <option value={6}>6×6</option>
            <option value={7}>7×7</option>
            <option value={10}>10×10</option>
          </select>
        </label>
      </header>

      {/* board layout */}
      <section>
        {solutions && solutions.length > 0 ? solutions.map((solution, index) => (
            <div key={pathToString(solution || [])} className="solution-container">
              <div className="solution-header">
                <h2>Solution {index + 1}</h2>
                <div>
                  {visualizedSolutions.includes(index) && (
                    <button
                      className="reset-button"
                      onClick={() => {
                        clearPathLinesForSolution(index);
                        setBoardState(prev => {
                          const newBoards = [...prev];
                          newBoards[index] = Array(boardSize)
                            .fill()
                            .map(() => Array(boardSize).fill(null));
                          return newBoards;
                        });
                        setVisualizedSolutions(prev => prev.filter(i => i !== index));
                      }}
                      style={{ marginRight: '10px' }}
                    >
                      Reset
                    </button>
                  )}
                  <button 
                    className="start-button"
                    onClick={() => setStartSolveIndex(index)}
                    disabled={startSolveIndex !== null}
                  >
                    Visualize Path
                  </button>
                </div>
              </div>
              <div
                ref={boardRefs.current[index]}
                className={`board-box-wrapper ${
                  boardSize === 10
                    ? "ten-grid"
                    : boardSize === 7
                      ? "seven-grid"
                      : boardSize === 6
                        ? "six-grid"
                        : "five-grid"
                }`}
              >
                {boardState[index] &&
                  boardState[index].map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        id={`${rowIndex}-${colIndex}`}
                        className={`
                      board-box
                      ${
                        currentBox[0] === colIndex && 
                        currentBox[1] === rowIndex && 
                        startSolveIndex === index ? "active" : ""
                      }
                      ${cell !== null ? "has-value" : ""}
                    `}
                        key={`${rowIndex}-${colIndex}`}
                      >
                        {cell}
                      </div>
                    )),
                  )}
              </div>
            </div>
          )) : <p>No solutions found. Try a different board size.</p>}
      </section>
    </div>
  );
}
