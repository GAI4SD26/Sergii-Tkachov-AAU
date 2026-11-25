# Research: Isometric Snake Game

## Self-contained Three.js delivery

**Decision**: Vendor the official Three.js r160 classic `build/three.min.js` and its MIT license; load it and application scripts locally as classic scripts. Do not fetch anything during play.

**Rationale**: The constitution requires Three.js and direct, offline operation with no build step or backend. The [r160 build directory](https://github.com/mrdoob/three.js/tree/r160/build) includes the classic browser build. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules/Modules_on_the_web) notes that browser module requests use CORS and direct `file://` module loading can fail. The [license](https://raw.githubusercontent.com/mrdoob/three.js/r160/LICENSE) requires inclusion of its notice.

**Alternatives considered**: Current ES-module builds would normally require a local server for reliable module loading; bundling them would add a build step. A canvas-only renderer would violate the constitution's Three.js requirement. The classic build is deprecated and absent from newer releases, so r160 is a deliberate compatibility trade-off; revisit the dependency if direct-open constraints change.

## Isometric presentation

**Decision**: Use a fixed Three.js orthographic camera angled toward a flat rectangular grid. Render cells, snake, and food with simple distinguishable geometry.

**Rationale**: An orthographic projection maintains apparent object size across depth, supporting a readable isometric-style board. See the [Three.js orthographic camera documentation](https://threejs.org/docs/pages/OrthographicCamera.html). The grid remains logically two-dimensional.

**Alternatives considered**: A perspective camera introduces depth-dependent scaling; a rotating camera adds controls outside the first-version scope.

## Rules, timing, and input

**Decision**: Use a 12 by 12 board, three initial segments, a 200 ms fixed movement interval, and arrow keys mapped to the four board axes, with the mapping shown on screen. Process at most one valid turn per step. Keep rules and injected random selection independent of the renderer.

**Rationale**: These are concrete, testable first-version defaults within the specification's assumptions. Separating state transitions from display makes collision, food placement, and restart deterministic to test.

**Alternatives considered**: Variable speed or configurable settings add scope; a renderer-owned snake position makes rules harder to test.

## Verification

**Decision**: Provide a locally openable browser test page for deterministic rule checks and a manual direct-open/offline gameplay guide. Use a first-use study to assess the two 90% usability targets; do not infer those results from an automated smoke test.

**Rationale**: This validates behavior in the target environment without requiring a test framework, package installation, or server.

**Alternatives considered**: An automated browser framework would add setup not otherwise required; manual play alone cannot reliably exercise full-board and tail-collision edge cases.
