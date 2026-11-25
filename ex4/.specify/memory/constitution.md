<!--
Sync Impact Report
Version change: uninitialized → 1.0.0 (initial adoption)
Modified principles: None; established five principles for the project.
Added sections: Technical Constraints; Development Workflow
Removed sections: None
Deferred: Original ratification date is unknown; replace its TODO when confirmed.
-->

# Browser Snake Game Constitution

## Core Principles

### I. Browser-First, Self-Contained
Deliver the game as a single-page HTML application using Three.js. It MUST run in a
modern browser without a backend, build step, or network access; include all required
libraries and assets locally.

### II. Reliable Game Rules
Keep game rules explicit and predictable. Snake movement, food collection, growth,
collision, scoring, and restart MUST behave consistently and be independent of rendering.

### III. Clear Controls and Feedback
Make game controls discoverable and responsive. Show the score and game-over state,
and provide a clear way to start or restart a game.

### IV. Focused, Maintainable Code
Prefer simple HTML, CSS, JavaScript, and Three.js solutions. Add frameworks, services,
or tooling only when a requirement justifies them.

### V. Verify Player-Facing Behavior
After gameplay changes, run the game in a browser and verify the affected behavior.
For core gameplay changes, check movement, food and scoring, collisions, and restart.

## Technical Constraints

Keep runtime dependencies and assets in the project. The game MUST NOT require network
access, a backend, or a build process to run in a modern browser.

## Development Workflow

Keep changes focused on the requested game behavior. Use existing checks when available;
otherwise perform a browser smoke test and report any behavior that could not be verified.

## Governance

This constitution governs project implementation and review. Amendments MUST document
their rationale and impact in this file. Use semantic versioning: MAJOR for incompatible
governance changes, MINOR for new or materially expanded requirements, and PATCH for
clarifications or non-semantic edits. Review each change for compliance and verify its
affected behavior before considering it complete.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2026-11-25
