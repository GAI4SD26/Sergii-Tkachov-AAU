# Quickstart and Validation: Isometric Snake Game

The application and its browser test runner can be opened directly from the project directory.

## Prerequisites and launch

- A modern desktop browser with WebGL enabled and a keyboard.
- Obtain the complete project including its locally vendored Three.js file and license. No installation, build, server, or runtime network connection is required.
- Open `index.html` from the project root directly in the browser. The address should use the local file scheme.
- Open `tests/game-tests.html` directly in the browser to run the rule checks. The page must show each result and a total; any failed check is a failure, not a pass.

## Rule checks

The browser tests should cover the transitions and invariants in [data-model.md](./data-model.md): initialization, each direction, reverse rejection, first valid input per step, growth and scoring, food on free cells, wall and body collisions, safe entry into a vacated tail cell, full-board completion, and fresh restart. Use controlled food choices and board states so edge cases do not depend on chance. Exercise the real UI update logic with controlled game-over and completed states to verify each message, final score, and restart action.

## End-to-end smoke test

1. Open the game with network connectivity disabled. Confirm the board, snake, food, score, start action, and control legend appear without requests for external resources.
2. Start the round and use the displayed arrow controls. Check that the snake keeps moving at a steady interval and changes direction as shown in the legend. Attempt a direct reversal and check it is ignored.
3. Guide the snake to food. Confirm it grows by one segment, the score increases by one, and new food appears in an empty cell.
4. Collide with the board boundary and confirm movement stops and the game-over message and final score appear. Restart and confirm a fresh snake, food, zero score, and moving round.
5. Confirm the deterministic browser tests exercise a body collision and full-board completion, including their messages, scores, and restart actions. Check the [UI contract](./contracts/ui.md) for expected feedback.
6. Check the browser console and visible page for errors; report any inability to perform a check rather than marking it successful.

## Usability outcomes

For SC-001 and SC-004, recruit at least 10 first-time participants. Without assistance, time each participant starting a round and turning, and separately identifying the final score and restarting after an ended round. At least 90% must complete each respective task within its specified 30-second or 15-second limit. Record the participant count and outcomes; the smoke test alone does not establish these targets.
