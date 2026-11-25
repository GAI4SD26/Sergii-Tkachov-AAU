# Data Model: Isometric Snake Game

## Board and coordinates

- Board: 12 columns by 12 rows, coordinates `x` and `y` each in the integer range 0 through 11.
- A cell has at most one snake segment or one food item. Neighboring snake segments differ by one on exactly one axis.
- Initial snake: head `(5, 5)`, followed by `(4, 5)` and `(3, 5)`; initial direction `(1, 0)`. Initial food is selected from free cells.

## Round

| Field | Meaning and invariant |
|-------|-----------------------|
| `state` | `ready`, `active`, `gameOver`, or `completed`. |
| `snake` | Ordered nonempty list of unique, contiguous cells, head first. |
| `direction` | One of `(1, 0)`, `(-1, 0)`, `(0, 1)`, `(0, -1)`. |
| `pendingDirection` | No turn or the first valid direction accepted since the previous step. |
| `food` | One free cell in ready and active states; absent when the board is full. |
| `score` | Nonnegative integer, initially zero, increased once per food consumed. |

These are in-memory concepts; no storage or public data API is needed.

## State transitions and rules

1. **Initialize**: Create the initial snake, direction, score zero, and food on a free cell; set `ready`. No movement occurs until start.
2. **Start**: `ready` to `active`; start one 200 ms movement schedule.
3. **Input while active**: If no direction is pending, accept the first valid board direction that is not the reverse of the current direction; ignore invalid or later inputs until the next step. Input in other states does not move the snake.
4. **Step**: Apply the pending direction if present and clear it. Compute the next head cell. A step outside the board ends in `gameOver`. A step into an occupied snake cell ends in `gameOver`, except that entering the old tail cell is allowed when not eating, because that tail leaves on the step.
5. **Normal move**: Add the next head and remove the old tail. The score and food do not change.
6. **Food move**: Add the next head without removing the tail and increment score by one. If free cells remain, choose one for the next food; otherwise clear food, enter `completed`, and stop movement.
7. **Restart**: From `gameOver` or `completed`, construct a fresh initial round, enter `active`, and start exactly one movement schedule. A prior schedule must be stopped before a new one starts.

Food selection samples only the enumerated free cells. Rule tests can inject deterministic selection so food and full-board outcomes are reproducible; invalid selection must be surfaced rather than silently accepted.
