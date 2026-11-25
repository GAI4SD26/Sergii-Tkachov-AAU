"use strict";

const SnakeGame = (() => {
  const SIZE = 12;

  function chooseFood(snake, random) {
    const occupied = new Set(snake.map(cell => `${cell.x},${cell.y}`));
    const free = [];
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        if (!occupied.has(`${x},${y}`)) free.push({ x, y });
      }
    }
    if (free.length === 0) return null;
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) {
      throw new RangeError("Food randomizer must return a number from 0 inclusive to 1 exclusive.");
    }
    return free[Math.floor(value * free.length)];
  }

  function createRound(random = Math.random) {
    const snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
    return {
      state: "ready",
      snake,
      direction: { x: 1, y: 0 },
      pendingDirection: null,
      food: chooseFood(snake, random),
      score: 0,
      random
    };
  }

  function start(round) {
    if (round.state === "ready") round.state = "active";
  }

  function turn(round, direction) {
    if (round.state !== "active" || round.pendingDirection) return;
    const { x, y } = direction;
    if (Math.abs(x) + Math.abs(y) !== 1 || !Number.isInteger(x) || !Number.isInteger(y)) return;
    if (x === -round.direction.x && y === -round.direction.y) return;
    round.pendingDirection = { x, y };
  }

  function step(round) {
    if (round.state !== "active") return;
    if (round.pendingDirection) round.direction = round.pendingDirection;
    round.pendingDirection = null;
    const head = round.snake[0];
    const next = { x: head.x + round.direction.x, y: head.y + round.direction.y };
    const eating = round.food && next.x === round.food.x && next.y === round.food.y;
    const outside = next.x < 0 || next.x >= SIZE || next.y < 0 || next.y >= SIZE;
    const occupied = round.snake.slice(0, eating ? undefined : -1)
      .some(cell => cell.x === next.x && cell.y === next.y);
    if (outside || occupied) {
      round.state = "gameOver";
      return;
    }
    round.snake.unshift(next);
    if (eating) {
      round.score++;
      round.food = chooseFood(round.snake, round.random);
      if (!round.food) round.state = "completed";
    } else {
      round.snake.pop();
    }
  }

  function restart(round) {
    if (round.state !== "gameOver" && round.state !== "completed") return;
    Object.assign(round, createRound(round.random));
    start(round);
  }

  return { SIZE, chooseFood, createRound, start, turn, step, restart };
})();
