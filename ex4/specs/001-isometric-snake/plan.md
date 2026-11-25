# Implementation Plan: Isometric Snake Game

**Branch**: `master` | **Date**: 2026-11-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from [spec.md](./spec.md). The setup script reports `001-isometric-snake` as its feature identifier; the actual current Git branch is `master`.

## Summary

Deliver a directly openable, offline single-player Snake game. Model the board and game rules independently of rendering, display the grid and pieces with a Three.js orthographic view, and provide keyboard controls, scoring, end-state feedback, and restart.

## Technical Context

**Language/Version**: HTML, CSS, and browser JavaScript using classic scripts.

**Primary Dependencies**: Locally vendored Three.js r160 `build/three.min.js`, with its license; no other runtime libraries.

**Storage**: In-memory round state only; no persistence.

**Testing**: Dependency-free browser rule and UI-state tests plus direct-open browser gameplay and offline smoke tests; first-use evaluation for the specification's usability criteria.

**Target Platform**: Modern desktop browsers with WebGL enabled and a keyboard.

**Project Type**: Self-contained single-page browser game.

**Performance Goals**: Consistent 200 ms game steps; user-facing first-use and restart targets are specified in SC-001 and SC-004. No frame-rate guarantee is assumed.

**Constraints**: Direct `file://` opening; no runtime network access, backend, server, build step, or external assets. Game rules must not depend on rendering.

**Scale/Scope**: One player, one fixed 12 by 12 board, one food item, and one active round. No accounts, persistence, levels, multiplayer, or touch-specific UI.

## Constitution Check

| Principle | Before design | After design |
|-----------|---------------|--------------|
| Browser-first and self-contained | Pass: local Three.js and classic scripts permit direct opening without a backend, network, or build. | Pass: all runtime assets are local, with no module imports or remote resources. |
| Reliable game rules | Pass: explicit grid rules are separate from rendering. | Pass: the model and transition rules are documented in [data-model.md](./data-model.md). |
| Clear controls and feedback | Pass: start, controls, score, end state, and restart are planned. | Pass: the [UI contract](./contracts/ui.md) specifies each state and interaction. |
| Focused, maintainable code | Pass: plain HTML, CSS, JavaScript, and the required Three.js dependency. | Pass: no framework, service, or build tooling is introduced. |
| Verify player-facing behavior | Pass: browser rule tests and manual smoke tests are planned. | Pass: [quickstart.md](./quickstart.md) covers the gameplay loop, offline opening, and edge cases. |

No violations or unresolved clarifications.

## Project Structure

### Documentation (this feature)

```text
specs/001-isometric-snake/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui.md
└── tasks.md             # Created later by /speckit-tasks
```

### Source Code (project root; planned)

```text
index.html                # Page, controls, and local script loading
styles/
└── style.css             # Layout and visible feedback
js/
├── game.js               # Grid state and rules, independent of Three.js
└── app.js                # Rendering, timing, input, and UI
vendor/
├── three.min.js          # Three.js r160 classic browser build
└── THREE-LICENSE.txt
tests/
├── game-tests.html       # Directly openable browser test runner
└── game-tests.js         # Deterministic rule, transition, and UI-state checks
```

**Structure Decision**: Use one static application at the project root. Classic local scripts avoid a server and ES-module `file://` restrictions. Keep game rules in a separate script for deterministic testing, and render their state without changing the model.

## Complexity Tracking

No constitution violations requiring justification.
