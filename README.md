# Knight's Tour
## GH page
link: https://linhema.github.io/knight-tour/

## Purpose
The Devil's Plan (Korean: 데블스 플랜) shows an interesting game called Knight's Tour. I was wondering if I could solve it.
After solving it, I found it had some patterns, so I tried to use my frontend skills to visualize them.

## Related Knowladge
### Chess
In chess, the knight moves in an L-shape pattern:
- Two squares in one direction (horizontal or vertical)
- Then one square perpendicular to the first direction

This creates a unique movement pattern where the knight:
- Can jump over other pieces
- Always lands on a square of the opposite color from its starting position
- Has up to 8 possible moves from any position on the board

Example of knight's possible moves from center position:

    2 _ 3 _ 4
    _ _ _ _ _
    5 _ K _ 6
    _ _ _ _ _
    7 _ 8 _ 1

K = Knight's position
1-8 = Possible moves
_ = Empty squares

Each number represents a possible landing position for the knight from its current position (K).

### Warnsdorf's rule
When I was using pen and paper, I solved 5*5 Knight's Tour problem in Warnsdorf's rule.
Warnsdorf's rule is a heuristic for finding a single knight's tour. The knight is moved so that it always proceeds to the square from which the knight will have the fewest onward moves. When calculating the number of onward moves for each candidate square, we do not count moves that revisit any square already visited. It is possible to have two or more choices for which the number of onward moves is equal; there are various methods for breaking such ties, including one devised by Pohl and another by Squirrel and Cull.

### Divide and Conquer
Writing this file, I found this problem can be solved in divide and conquer methods.I haven't tried it yet.
