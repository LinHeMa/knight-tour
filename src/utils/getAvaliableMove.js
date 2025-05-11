// Global set to store all found solutions
const allSolutions = new Set();

export function getAvailableMoves(position, size, boardState) {
  const availableMoves = [];
  // Knight's movement patterns
  const movements = [
    { x: +2, y: -1 },
    { x: +2, y: +1 },
    { x: -2, y: -1 },
    { x: -2, y: +1 },
    { x: -1, y: +2 },
    { x: +1, y: +2 },
    { x: -1, y: -2 },
    { x: +1, y: -2 },
  ];

  const [posX, posY] = position;

  for (const move of movements) {
    const { x, y } = move;
    const newX = posX + x;
    const newY = posY + y;

    // Check if the new position is within the board boundaries
    if (newX < 0 || newX >= size || newY < 0 || newY >= size) {
      continue;
    }

    // Check if the position has not been visited yet
    if (boardState[newY][newX] !== null) {
      continue;
    }

    availableMoves.push([newX, newY]);
  }

  return availableMoves;
}

// Converts a path to a string for storage in the Set
export function pathToString(path) {
  return path.map((pos) => pos.join(",")).join("|");
}

export function findAllSolutions(
  startPosition,
  size,
  boardState,
  maxSolutions = 100,
) {
  // Clear the global solutions set
  allSolutions.clear();

  // Call the recursive search function
  searchSolutions(
    startPosition,
    size,
    JSON.parse(JSON.stringify(boardState)),
    [],
    1,
    maxSolutions,
  );

  // Convert the Set to an array and return
  return Array.from(allSolutions).map((solStr) =>
    solStr.split("|").map((posStr) => posStr.split(",").map(Number)),
  );
}

function searchSolutions(
  currentPosition,
  size,
  boardState,
  path,
  moveNumber,
  maxSolutions,
) {
  // Deep copy the current path and add the current position
  const currentPath = [...path, currentPosition];

  // Mark the current position as visited
  const [posX, posY] = currentPosition;
  boardState[posY][posX] = moveNumber;

  // Check if the knight's tour is complete (all squares visited)
  const totalSquares = size * size;
  if (currentPath.length === totalSquares) {
    // Found a complete solution, add it to the global set
    const pathStr = pathToString(currentPath);
    allSolutions.add(pathStr);

    console.log(`Found solution #${allSolutions.size}`);

    // Stop searching if the maximum number of solutions is reached
    if (allSolutions.size >= maxSolutions) {
      return true; // Indicates the maximum number of solutions is reached
    }

    return false; // Continue searching for other solutions
  }

  // Get all possible moves from the current position
  const availableMoves = getAvailableMoves(currentPosition, size, boardState);

  if (availableMoves.length === 0) {
    // No more possible moves, but not all squares visited - dead end
    return false;
  }

  // Calculate the number of onward moves for each possible move
  const movesWithCounts = availableMoves.map((move) => {
    // Temporarily mark this position
    const [moveX, moveY] = move;
    boardState[moveY][moveX] = moveNumber + 1;

    const onwardMoveCount = getAvailableMoves(move, size, boardState).length;

    // Reset this position
    boardState[moveY][moveX] = null;

    return {
      pos: move,
      onwardMoveCount,
    };
  });

  // Sort by Warnsdorff's rule (prioritize moves with the fewest onward moves)
  movesWithCounts.sort((a, b) => a.onwardMoveCount - b.onwardMoveCount);

  // Recursively search for all possible solutions
  for (const moveData of movesWithCounts) {
    // Create a new board state copy
    const newBoardState = JSON.parse(JSON.stringify(boardState));

    // Recursive search
    const finished = searchSolutions(
      moveData.pos,
      size,
      newBoardState,
      currentPath,
      moveNumber + 1,
      maxSolutions,
    );

    // Stop searching if the maximum number of solutions is reached
    if (finished) {
      return true;
    }
  }

  return false;
}

/** Example usage:
const boardSize = 5;
const board = Array(boardSize)
  .fill()
  .map(() => Array(boardSize).fill(null));
const startPos = [0, 0];
const allPossibleSolutions = findAllSolutions(startPos, boardSize, board, 100); // Limit to finding 100 solutions
console.log("allPossibleSolutions", allPossibleSolutions[99]);
 */
