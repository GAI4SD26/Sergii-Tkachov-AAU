---
description: "Implementation tasks for the isometric Snake game"
---

# Tasks: Isometric Snake Game

**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [UI contract](./contracts/ui.md), and [quickstart.md](./quickstart.md)

**Tests**: The specification requires scripted playthroughs and the constitution requires browser verification. Include the focused, dependency-free browser tests and smoke checks described by the plan.

**Organization**: Tasks are grouped by user story; paths are relative to the project root.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other marked tasks in the same indicated group, without file conflicts or dependencies.
- **[US1] / [US2]**: User story from the specification.

## Phase 1: Setup

**Purpose**: Establish the local, directly openable application.

- [X] T001 [P] Vendor the official Three.js r160 classic browser build and its MIT license as `vendor/three.min.js` and `vendor/THREE-LICENSE.txt`, using the source identified in `specs/001-isometric-snake/research.md`.
- [X] T002 [P] Create `index.html` with local classic-script references, a board container, score, start and restart controls, visible keyboard legend, and status/error regions following `specs/001-isometric-snake/contracts/ui.md`.
- [X] T003 [P] Create `styles/style.css` for a readable desktop board layout, distinguishable feedback and controls, and visible keyboard focus.

---

## Phase 2: Foundational

**Purpose**: Provide shared round state and a browser test entry point before story implementation.

- [X] T004 [P] Create the rendering-independent initial round in `js/game.js`, implementing [data-model.md: Board.x](./data-model.md#board-and-coordinates), [data-model.md: Board.y](./data-model.md#board-and-coordinates), [data-model.md: Round.state](./data-model.md#round), [data-model.md: Round.snake](./data-model.md#round), [data-model.md: Round.direction](./data-model.md#round), [data-model.md: Round.pendingDirection](./data-model.md#round), [data-model.md: Round.food](./data-model.md#round), and [data-model.md: Round.score](./data-model.md#round); enumerate free cells for food selection and surface invalid injected selections.
- [X] T005 [P] Create `tests/game-tests.html` as a directly openable local browser runner that loads `js/game.js` and `tests/game-tests.js`, displays individual results and a pass/fail total, and requires no server or packages.

**Checkpoint**: Shared model initialization and the test runner are ready.

---

## Phase 3: User Story 1 - Play a Snake Game (Priority: P1)

**Goal**: Start a round, steer on an isometric board, collect food, and see growth and score.

**Independent Test**: Open `index.html` locally, start a round, steer to food, and observe movement, one-segment growth, one-point scoring, and replacement food.

### Tests for User Story 1

- [X] T006 [US1] Add deterministic tests in `tests/game-tests.js` for initial state, four-direction movement, invalid reversals, first valid input per step, food placement on free cells, growth, and scoring; use the runner in `tests/game-tests.html` and confirm new behavior fails before implementation.

### Implementation for User Story 1

- [X] T007 [US1] Implement start, turn queuing, movement, food collection, and valid free-cell food selection in `js/game.js`, preserving [data-model.md: Round.state](./data-model.md#round), [data-model.md: Round.snake](./data-model.md#round), [data-model.md: Round.direction](./data-model.md#round), [data-model.md: Round.pendingDirection](./data-model.md#round), [data-model.md: Round.food](./data-model.md#round), and [data-model.md: Round.score](./data-model.md#round) and the model's state transitions.
- [X] T008 [P] [US1] Implement the fixed orthographic Three.js board and distinct head, body, and food rendering in `js/app.js`, displaying state from `js/game.js` without modifying game rules.
- [X] T009 [P] [US1] Refine `styles/style.css` for a readable score, start control, board, and arrow-key legend that communicates the projected board directions from `specs/001-isometric-snake/contracts/ui.md`.
- [X] T010 [US1] Connect start, arrow keys, 200 ms movement scheduling, score updates, and rendering in `js/app.js` and `index.html`; show a visible error if rendering initialization fails, and avoid multiple movement schedules.
- [X] T011 [US1] Run the US1 browser checks in `tests/game-tests.html` and the direct-open gameplay steps in `specs/001-isometric-snake/quickstart.md`; verify steering, food, growth, and score and report any unverified behavior.

**Checkpoint**: The playable core is independently demonstrable; end-of-round handling follows in US2.

---

## Phase 4: User Story 2 - Finish and Restart a Round (Priority: P2)

**Goal**: End rounds correctly on collisions or a full board, show outcomes, and restart cleanly.

**Independent Test**: Cause wall and body collisions, verify final score and stopped movement, then restart; use controlled states to verify full-board completion and restart.

### Tests for User Story 2

- [X] T012 [US2] Extend `tests/game-tests.js` with deterministic wall and body collision, vacated-tail, full-board completion, post-end input, restart, single-schedule, and real UI-state checks for messages, final score, and restart actions; confirm the new checks fail before implementation.

### Implementation for User Story 2

- [X] T013 [P] [US2] Implement boundary and body collision, vacated-tail handling, full-board completion, ignored post-end input, and fresh round state in `js/game.js`, enforcing [data-model.md: Round.state](./data-model.md#round), [data-model.md: Round.snake](./data-model.md#round), [data-model.md: Round.direction](./data-model.md#round), [data-model.md: Round.pendingDirection](./data-model.md#round), [data-model.md: Round.food](./data-model.md#round), and [data-model.md: Round.score](./data-model.md#round).
- [X] T014 [P] [US2] Extend the existing state-to-UI rendering in `js/app.js` to display distinct game-over and completion messages, final score, and restart control according to `specs/001-isometric-snake/contracts/ui.md`; use the established round-state interface.
- [X] T015 [US2] Wire ended-state transitions and restart in `js/app.js` and `index.html` after T013 and T014, stopping the old timer and starting exactly one fresh schedule with reset snake, food, direction, and score.
- [X] T016 [US2] Run `tests/game-tests.html` and the ending/restart browser scenarios in `specs/001-isometric-snake/quickstart.md`, including controlled full-board UI feedback; report any unverified behavior.

**Checkpoint**: Both stories work together and the complete round can be replayed.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verify the full user-facing feature and document how to run it.

- [X] T017 [P] Write `README.md` with direct-open instructions, controls, offline behavior, local Three.js attribution, and test entry point, consistent with `specs/001-isometric-snake/quickstart.md`.
- [X] T018 Run all checks in `tests/game-tests.html` and the offline direct-open smoke test in `specs/001-isometric-snake/quickstart.md`; confirm no external runtime requests and report failures or unavailable checks.
- [X] T019 Evaluate SC-001 and SC-004 using the first-use procedure in `specs/001-isometric-snake/quickstart.md` when at least 10 participants are available; record counts and results, or explicitly report the study as not performed rather than claiming success.

**Usability study status**: Not performed; first-time participants were not available. SC-001 and SC-004 remain unverified.

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup T001-T003 can run concurrently; complete them before Foundation.
- Foundation T004 and T005 can run concurrently; complete both before US1.
- US1 follows Foundation; US2 follows US1 because it extends the playable game loop and existing UI-state interface.
- Final validation follows both stories. T017 may run in parallel with T018 once the implementation is stable; T019 requires participants and must not be reported as passed without results.

### User Story Dependencies

- **US1 (P1)**: Depends on Setup and Foundation, not US2.
- **US2 (P2)**: Depends on US1's model, rendering, and scheduling; it is independently tested by driving the existing game to an ending and restarting it.

### Within Each User Story

- Write and run the story's new failing tests before implementing it.
- US1: T006 precedes T007-T010; T008 and T009 can run together after T007. T010 follows T008 and T009; T011 follows T010.
- US2: T012 precedes T013 and T014; T013 and T014 can run together against the US1 state interface. T015 follows both; T016 follows T015.

## Parallel Examples

### User Story 1

After T007, one contributor can implement the Three.js renderer in `js/app.js` (T008) while another refines `styles/style.css` (T009). Integrate them in T010.

### User Story 2

After T012, one contributor can implement ending rules in `js/game.js` (T013) while another implements ended-state display in `js/app.js` (T014). Integrate restart and scheduling in T015.

## Implementation Strategy

### MVP First

Complete Setup, Foundation, and US1, then run its independent test. This demonstrates the board, movement, food, growth, and scoring; it does not yet deliver the complete end-and-restart loop.

### Incremental Delivery

1. Complete US1 and validate the playable core.
2. Complete US2 and validate collisions, completion, and restart.
3. Perform offline end-to-end checks and the first-use evaluation; report any unavailable validation explicitly.
