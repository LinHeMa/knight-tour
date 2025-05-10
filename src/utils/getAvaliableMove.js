export function getAvailableMoves(position, size, boardState) {
  const availableMoves = [];
  // Knight's move patterns
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

    // Check if the new position is within bounds
    if (newX < 0 || newX >= size || newY < 0 || newY >= size) {
      continue;
    }

    // Check if the position is not already visited
    if (boardState[newY][newX] !== null) {
      continue;
    }

    availableMoves.push([newX, newY]);
  }

  return availableMoves;
}

export function getSolution(startPosition, size, boardState) {
  // Deep copy the board state to avoid modifying the original
  const boardStateLocal = JSON.parse(JSON.stringify(boardState));

  // Mark the starting position as visited with move number 1
  const [startX, startY] = startPosition;
  boardStateLocal[startY][startX] = 1;

  // Path will contain the sequence of moves
  const path = [startPosition];
  let currentPosition = startPosition;
  let moveNumber = 2;

  // A knight's tour should visit all squares exactly once
  const totalSquares = size * size;

  while (path.length < totalSquares) {
    // Get all valid moves from current position
    const availableMoves = getAvailableMoves(
      currentPosition,
      size,
      boardStateLocal,
    );

    if (availableMoves.length === 0) {
      // No more moves available, but not all squares visited - no solution found
      console.log(
        "No complete solution found, visited",
        path.length,
        "squares",
      );
      return path; // Return partial path
    }

    // Use Warnsdorff's heuristic: choose the move with fewest onward moves
    let nextMove = null;
    let minOnwardMoves = Infinity;

    for (const move of availableMoves) {
      // Temporarily mark this position to check available moves from here
      const [moveX, moveY] = move;
      boardStateLocal[moveY][moveX] = moveNumber;

      const onwardMoveCount = getAvailableMoves(
        move,
        size,
        boardStateLocal,
      ).length;
      boardStateLocal[moveY][moveX] = null; // Reset for accurate checking of other moves

      if (onwardMoveCount < minOnwardMoves) {
        minOnwardMoves = onwardMoveCount;
        nextMove = move;
      }
    }

    // Make the move with fewest onward options
    const [nextX, nextY] = nextMove;
    boardStateLocal[nextY][nextX] = moveNumber;
    path.push(nextMove);
    currentPosition = nextMove;
    moveNumber++;
  }

  return path;
}
