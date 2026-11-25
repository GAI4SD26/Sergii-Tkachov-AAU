"use strict";

const SnakeApp = (() => {
  const keys = {
    ArrowUp: { x: 0, y: -1 },
    ArrowRight: { x: 1, y: 0 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }
  };

  function createRenderer(container) {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 100);
    camera.position.set(17, 22, 17);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9cad85, 2));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(-5, 15, 8);
    scene.add(light);

    const tileGeometry = new THREE.BoxGeometry(0.98, 0.16, 0.98);
    const tileMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xc3d3b1 }),
      new THREE.MeshStandardMaterial({ color: 0xb9cba7 })
    ];
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(12.2, 0.5, 12.2),
      new THREE.MeshStandardMaterial({ color: 0x829c70 })
    );
    base.position.y = -0.3;
    scene.add(base);
    for (let y = 0; y < SnakeGame.SIZE; y++) {
      for (let x = 0; x < SnakeGame.SIZE; x++) {
        const tile = new THREE.Mesh(tileGeometry, tileMaterials[(x + y) % 2]);
        tile.position.set(x - 5.5, 0, y - 5.5);
        scene.add(tile);
      }
    }

    const pieces = new THREE.Group();
    scene.add(pieces);
    const segmentGeometry = new THREE.BoxGeometry(0.85, 0.48, 0.85);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x375d40, roughness: 0.7 });
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x5c8258, roughness: 0.7 });
    const foodGeometry = new THREE.SphereGeometry(0.32, 16, 12);
    const foodMaterial = new THREE.MeshStandardMaterial({ color: 0xe48b61, roughness: 0.6 });

    function render(round) {
      pieces.clear();
      round.snake.forEach((cell, index) => {
        const segment = new THREE.Mesh(segmentGeometry, index === 0 ? headMaterial : bodyMaterial);
        segment.position.set(cell.x - 5.5, 0.32, cell.y - 5.5);
        pieces.add(segment);
      });
      if (round.food) {
        const fruit = new THREE.Mesh(foodGeometry, foodMaterial);
        fruit.position.set(round.food.x - 5.5, 0.4, round.food.y - 5.5);
        pieces.add(fruit);
      }
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      const halfHeight = 10;
      camera.left = -halfHeight * width / height;
      camera.right = halfHeight * width / height;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    }

    return render;
  }

  function createController({ root, render, round = SnakeGame.createRound(),
    schedule = (callback, delay) => window.setInterval(callback, delay),
    cancel = id => window.clearInterval(id) }) {
    const score = root.querySelector("#score");
    const status = root.querySelector("#status");
    const startButton = root.querySelector("#start");
    const restartButton = root.querySelector("#restart");
    let timer = null;

    function update() {
      score.textContent = String(round.score);
      startButton.hidden = round.state !== "ready";
      restartButton.hidden = round.state !== "gameOver" && round.state !== "completed";
      const messages = {
        ready: "Ready when you are.",
        active: "On the move. You got this.",
        gameOver: "Game over. Nice run!",
        completed: "Board complete! You filled the grid."
      };
      status.textContent = messages[round.state];
      render(round);
    }

    function scheduleMovement() {
      if (timer !== null) cancel(timer);
      timer = schedule(() => {
        SnakeGame.step(round);
        if (round.state !== "active") {
          cancel(timer);
          timer = null;
        }
        update();
      }, 200);
      update();
    }

    function start() {
      if (round.state !== "ready") return;
      SnakeGame.start(round);
      scheduleMovement();
    }

    function restart() {
      if (round.state !== "gameOver" && round.state !== "completed") return;
      SnakeGame.restart(round);
      scheduleMovement();
    }

    function onKey(event) {
      const direction = keys[event.key];
      if (!direction || round.state !== "active") return;
      event.preventDefault();
      SnakeGame.turn(round, direction);
    }

    startButton.addEventListener("click", start);
    restartButton.addEventListener("click", restart);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", update);
    update();
    return { update, start, restart, getRound: () => round };
  }

  function initialize() {
    const root = document.getElementById("game");
    if (!root) return;
    try {
      const render = createRenderer(document.getElementById("game-board"));
      createController({ root, render });
    } catch (error) {
      console.error("Could not initialize the game renderer:", error);
      const message = root.querySelector("#error");
      message.textContent = "The game could not start. Check that WebGL is enabled and all local files are present.";
      message.hidden = false;
      root.querySelector("#start").disabled = true;
    }
  }

  initialize();
  return { createController };
})();
