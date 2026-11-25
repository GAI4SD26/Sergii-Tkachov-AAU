# Player Interface Contract

## Display and controls

- The initial view shows an isometric-style board, snake, food, score `0`, a start action, and a visible arrow-key-to-board-direction legend.
- Arrow keys steer along the four board axes; the legend must show how each key maps onto the projected board. Accepted turns take effect at the next movement step. Reverse and additional queued turns are ignored as described in [data-model.md](../data-model.md).
- The board boundary, head, body, and food are visually distinguishable. The score is visible throughout a round.

## State-dependent behavior

| State | Visible feedback | Player action |
|-------|------------------|---------------|
| Ready | Initial board, score, instructions, start action | Start begins movement. |
| Active | Board, score, instructions | Arrow keys request direction changes. |
| Game over | Game-over message, final score, restart action | Restart begins a fresh round. |
| Completed | Completion message, final score, restart action | Restart begins a fresh round. |

Both ending states stop movement; arrow keys alone cannot resume them. Restart resets the score, snake, direction, and food before play resumes.

If rendering cannot initialize, show a visible error instead of presenting a nonfunctional game as playable.
