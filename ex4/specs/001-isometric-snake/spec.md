# Feature Specification: Isometric Snake Game

**Feature Branch**: `master` (existing branch; no feature branch created)

**Created**: 2026-11-25

**Status**: Draft

**Input**: User description: "lets scaffold the project to first base running version. It should be a classical snake game, with osme sort of isometric view on a board."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play a Snake Game (Priority: P1)

A player opens the game, sees an isometric-style board and the available controls, starts a game, and guides a moving snake toward food.

**Why this priority**: A visible board and playable snake are the core value of the first version.

**Independent Test**: Open the game, start a round, steer the snake to food, and observe movement, growth, and scoring.

**Acceptance Scenarios**:

1. **Given** the game is opened, **When** the player views the initial screen, **Then** an isometric-style board, a snake, the score, start action, and directional controls are visible.
2. **Given** a round has started and no valid turn has been queued for the next step, **When** the player uses a displayed directional control that does not reverse the snake, **Then** the snake moves in the corresponding board direction on its next movement step.
3. **Given** the snake reaches food, **When** it moves onto the food's cell, **Then** the snake grows by one segment, the score increases by one, and new food appears on an unoccupied cell if one exists.

---

### User Story 2 - Finish and Restart a Round (Priority: P2)

A player receives clear feedback when the round ends and can start a fresh game without reopening the application.

**Why this priority**: Losing and restarting complete the classic gameplay loop.

**Independent Test**: Start a round, collide with a board boundary or the snake's body, then restart and verify the initial state.

**Acceptance Scenarios**:

1. **Given** an active round, **When** the snake moves beyond the board boundary or into a body cell that remains occupied after the move, **Then** movement stops and the game-over state and final score are shown.
2. **Given** a game-over or completed round, **When** the player chooses restart, **Then** a new round begins with the initial snake, one food item, and a score of zero.
3. **Given** the snake occupies every board cell after eating, **When** there is no free cell for new food, **Then** the round ends with a completion message and final score.

### Edge Cases

- An input that would reverse the snake directly into its body is ignored; the snake continues in its current direction.
- When several direction inputs arrive before a movement step, only the first valid input for that step is applied; inputs are validated against the current direction.
- Moving into the cell vacated by the tail on the same step is allowed when the snake is not growing.
- Food never appears on a cell occupied by the snake; a full board ends the round instead of attempting to place more food.
- Directional input after a round ends does not resume the ended round; the player must restart.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST present a bounded, discrete board in an isometric-style view, with distinguishable snake segments and food.
- **FR-002**: The game MUST show a start action, current score, and the directional controls before play begins.
- **FR-003**: The player MUST be able to start a round and steer the snake in the four board directions using the displayed keyboard controls.
- **FR-004**: During an active round, the snake MUST advance one board cell at a time at a consistent interval, including when no new direction is entered.
- **FR-005**: The game MUST reject a direction that directly reverses the snake's current direction and MUST apply at most the first valid direction input between movement steps.
- **FR-006**: Each round MUST begin with a snake occupying contiguous board cells, one food item on an unoccupied cell, and a score of zero.
- **FR-007**: When the snake enters a food cell, it MUST grow by one segment, increase the score by one, and place one new food item on an unoccupied cell when one is available.
- **FR-008**: A move beyond the board boundary or into a body cell that remains occupied after the move MUST end the round, stop movement, and display a game-over message and final score.
- **FR-009**: Moving into the tail's previous cell MUST be permitted when the tail moves away on that step; otherwise, entering an occupied body cell ends the round.
- **FR-010**: If the snake fills the board, the game MUST end the round with a completion message and final score instead of placing food.
- **FR-011**: After a round ends, the player MUST be able to restart without reopening the game, restoring the initial round state and resuming movement.
- **FR-012**: The game MUST run in a modern browser without network access, a backend, or a build step.

### Key Entities *(include if feature involves data)*

- **Board**: A bounded grid of cells presented from an isometric-style viewpoint.
- **Snake**: An ordered sequence of contiguous occupied cells with a head, body, current direction, and length.
- **Food**: One collectible item on an unoccupied board cell during an active round, except when the board is full.
- **Round**: The current board, snake, food, score, and state: ready, active, game over, or completed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a first-use test, at least 90% of participants can start a round and change the snake's direction within 30 seconds without outside assistance.
- **SC-002**: In a scripted playthrough, 100% of food collections increase the score by one and grow the snake by one segment.
- **SC-003**: In separate scripted playthroughs, wall collision, body collision, and filling the board each end the round with the appropriate visible outcome in 100% of attempts.
- **SC-004**: In a first-use test, at least 90% of participants can identify the final score and restart an ended round within 15 seconds without outside assistance.
- **SC-005**: A player can open and complete a round with network connectivity disabled and without a separate setup or build step.

## Assumptions

- This is a single-player game for a desktop player using a keyboard; touch controls and mobile-specific layouts are outside the first version.
- The board is a fixed rectangular grid, and the snake moves at a constant speed for a round. Exact dimensions, initial length, and speed can be selected during planning.
- The isometric-style view is a visual presentation of the grid; it does not change the four-directional gameplay rules.
- The score counts food collected during the current round; persistent high scores, accounts, levels, and multiplayer are outside scope.
- All assets needed to play are available locally; no external service is required.