"use strict";

const results = document.getElementById("results");
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function equal(actual, expected, message) {
  assert(JSON.stringify(actual) === JSON.stringify(expected),
    `${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function test(name, fn) {
  const item = document.createElement("li");
  try {
    fn();
    item.textContent = `PASS: ${name}`;
    passed++;
  } catch (error) {
    item.textContent = `FAIL: ${name}: ${error.message}`;
    failed++;
    console.error(name, error);
  }
  results.appendChild(item);
}

test("initial state and free food", () => {
  const round = SnakeGame.createRound(() => 0);
  equal(round.state, "ready", "state");
  equal(round.snake, [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }], "snake");
  equal(round.score, 0, "score");
  assert(!round.snake.some(cell => cell.x === round.food.x && cell.y === round.food.y), "food overlaps snake");
  assert(round.food.x >= 0 && round.food.x < 12 && round.food.y >= 0 && round.food.y < 12, "food outside board");
});

test("invalid random food selection is surfaced", () => {
  let threw = false;
  try { SnakeGame.createRound(() => 1); } catch (error) { threw = error instanceof RangeError; }
  assert(threw, "invalid random value should throw");
});

test("moves in all four directions", () => {
  const round = SnakeGame.createRound(() => 0);
  SnakeGame.start(round);
  for (const [direction, expected] of [
    [{ x: 0, y: -1 }, { x: 5, y: 4 }],
    [{ x: -1, y: 0 }, { x: 4, y: 4 }],
    [{ x: 0, y: 1 }, { x: 4, y: 5 }],
    [{ x: 1, y: 0 }, { x: 5, y: 5 }]
  ]) {
    SnakeGame.turn(round, direction);
    SnakeGame.step(round);
    equal(round.snake[0], expected, "head");
  }
});

test("rejects reverse and accepts only first valid turn per step", () => {
  const round = SnakeGame.createRound(() => 0);
  SnakeGame.start(round);
  SnakeGame.turn(round, { x: -1, y: 0 });
  SnakeGame.turn(round, { x: 0, y: -1 });
  SnakeGame.turn(round, { x: 0, y: 1 });
  SnakeGame.step(round);
  equal(round.snake[0], { x: 5, y: 4 }, "first valid turn");
  SnakeGame.step(round);
  equal(round.snake[0], { x: 5, y: 3 }, "continues moving");
});

test("food grows snake and increments score", () => {
  const round = SnakeGame.createRound(() => 0);
  round.food = { x: 6, y: 5 };
  SnakeGame.start(round);
  SnakeGame.step(round);
  equal(round.snake.length, 4, "length");
  equal(round.score, 1, "score");
  assert(round.food && !round.snake.some(cell => cell.x === round.food.x && cell.y === round.food.y), "replacement food overlaps snake");
});

test("wall collision ends round and ignores subsequent input", () => {
  const round = SnakeGame.createRound(() => 0);
  round.snake = [{ x: 11, y: 5 }, { x: 10, y: 5 }, { x: 9, y: 5 }];
  SnakeGame.start(round);
  SnakeGame.step(round);
  equal(round.state, "gameOver", "wall collision");
  const snake = JSON.stringify(round.snake);
  SnakeGame.turn(round, { x: 0, y: -1 });
  SnakeGame.step(round);
  equal(JSON.stringify(round.snake), snake, "ended round remains unchanged");
  equal(round.pendingDirection, null, "ended round ignores turns");
});

test("body collision ends round but entering a vacated tail is allowed", () => {
  const body = SnakeGame.createRound(() => 0);
  body.snake = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
  body.direction = { x: -1, y: 0 };
  SnakeGame.start(body);
  SnakeGame.step(body);
  equal(body.state, "gameOver", "body collision");

  const tail = SnakeGame.createRound(() => 0);
  tail.snake = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }];
  tail.direction = { x: -1, y: 0 };
  SnakeGame.start(tail);
  SnakeGame.step(tail);
  equal(tail.state, "active", "vacated tail");
  equal(tail.snake[0], { x: 4, y: 5 }, "head moves to vacated tail");
});

test("filling the board completes round without replacing food", () => {
  const path = [];
  for (let y = 0; y < 12; y++) {
    for (let i = 0; i < 12; i++) path.push({ x: y % 2 ? 11 - i : i, y });
  }
  const round = SnakeGame.createRound(() => 0);
  round.snake = path.slice(0, -1).reverse();
  round.food = path[path.length - 1];
  round.direction = { x: -1, y: 0 };
  round.score = 140;
  SnakeGame.start(round);
  SnakeGame.step(round);
  equal(round.state, "completed", "completion");
  equal(round.snake.length, 144, "full snake length");
  equal(round.score, 141, "final score");
  equal(round.food, null, "no replacement food");
});

function controllerFixture() {
  const root = document.createElement("section");
  root.innerHTML = '<span id="score"></span><p id="status"></p><button id="start">Start</button><button id="restart">Restart</button>';
  document.body.appendChild(root);
  const active = new Map();
  let nextId = 0;
  const round = SnakeGame.createRound(() => 0);
  const controller = SnakeApp.createController({
    root, round, render: () => {},
    schedule: (callback, delay) => {
      equal(delay, 200, "movement interval");
      const id = ++nextId;
      active.set(id, callback);
      return id;
    },
    cancel: id => active.delete(id)
  });
  return { root, round, controller, active, tick: () => [...active.values()][0]() };
}

test("collision UI shows final score, stops timer, and restart creates one fresh schedule", () => {
  const fixture = controllerFixture();
  const { root, round, active } = fixture;
  root.querySelector("#start").click();
  round.snake = [{ x: 11, y: 5 }, { x: 10, y: 5 }, { x: 9, y: 5 }];
  round.score = 7;
  fixture.tick();
  equal(active.size, 0, "ended schedule");
  assert(/game over/i.test(root.querySelector("#status").textContent), "game-over message");
  equal(root.querySelector("#score").textContent, "7", "final score");
  assert(!root.querySelector("#restart").hidden, "restart visible");
  root.querySelector("#restart").click();
  equal(round.state, "active", "restart state");
  equal(round.score, 0, "restart score");
  equal(round.snake.length, 3, "restart snake");
  equal(active.size, 1, "one active schedule");
  root.querySelector("#restart").click();
  equal(active.size, 1, "repeated restart does not duplicate schedule");
  root.remove();
});

test("completion UI shows final score and restarts", () => {
  const fixture = controllerFixture();
  const { root, round, active } = fixture;
  root.querySelector("#start").click();
  const path = [];
  for (let y = 0; y < 12; y++) {
    for (let i = 0; i < 12; i++) path.push({ x: y % 2 ? 11 - i : i, y });
  }
  round.snake = path.slice(0, -1).reverse();
  round.food = path[path.length - 1];
  round.direction = { x: -1, y: 0 };
  round.score = 140;
  fixture.tick();
  assert(/complete/i.test(root.querySelector("#status").textContent), "completion message");
  equal(root.querySelector("#score").textContent, "141", "completion score");
  assert(!root.querySelector("#restart").hidden, "restart visible");
  equal(active.size, 0, "ended schedule");
  root.querySelector("#restart").click();
  equal(round.state, "active", "restart state");
  equal(round.score, 0, "restart score");
  equal(active.size, 1, "one active schedule");
  root.remove();
});

test("body collision reaches game-over UI", () => {
  const fixture = controllerFixture();
  const { root, round, active } = fixture;
  root.querySelector("#start").click();
  round.snake = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
  round.direction = { x: -1, y: 0 };
  fixture.tick();
  assert(/game over/i.test(root.querySelector("#status").textContent), "game-over message");
  assert(!root.querySelector("#restart").hidden, "restart visible");
  equal(active.size, 0, "ended schedule");
  root.remove();
});

document.getElementById("summary").textContent = `${passed} passed, ${failed} failed`;
