/* eslint-disable @typescript-eslint/no-unused-vars */
/* global createCanvas, noSmooth, frameRate, noLoop, loadImage, background, push, pop, stroke, strokeWeight, line, fill, rect, noStroke, textAlign, textSize, text, map, sin, frameCount, ceil, floor, random, abs, dist, tint, noTint, LEFT, TOP, CENTER, RIGHT_ARROW, DOWN_ARROW, LEFT_ARROW, UP_ARROW */

const MOVE_VECTORS = [
  { x: 1, y: 0 }, // right
  { x: 0, y: 1 }, // down
  { x: -1, y: 0 }, // left
  { x: 0, y: -1 } // up
];

const STATUS = {
  intro: "Press Space to start.",
  running: "Use arrow keys to move through the maze.",
  powered: "Super Saiyan state active: you can reset stressors.",
  clone: "Clone active: money and reading are chasing your double.",
  cloneLost: "Your clone got overwhelmed. You're on your own again.",
  magnet: "Burger magnet active: nearby 7th Street Burgers are pulling in.",
  win: "You collected every 7th Street Burger. Press Space to play again.",
  gameOver: "Stress got you. Press Space to restart."
};

const ASSET_PATHS = {
  brick: "assets/brick.svg",
  food: "assets/burger-polished.svg",
  powerup: "assets/powerup-polished.svg",
  clone: "assets/clone-polished.svg",
  magnet: "assets/magnet-polished.svg",
  pacman: "assets/pacman-polished.svg",
  pacmanPowered: "assets/pacman-powered-polished.svg",
  broom: "assets/broom-polished.svg",
  money: "assets/money-polished.svg",
  fork: "assets/fork-polished.svg",
  read: "assets/read-polished.svg"
};

const assets = {
  brick: null,
  food: null,
  powerup: null,
  clone: null,
  magnet: null,
  pacman: null,
  pacmanPowered: null,
  broom: null,
  money: null,
  fork: null,
  read: null
};

const FALLBACK_THEME = {
  wall: { fill: [42, 52, 66], accent: [66, 78, 94], text: [229, 236, 246] },
  food: { fill: [159, 108, 43], accent: [210, 145, 65], text: [255, 245, 225] },
  powerup: { fill: [90, 56, 150], accent: [133, 88, 213], text: [241, 231, 255] },
  clone: { fill: [71, 98, 180], accent: [143, 213, 238], text: [239, 255, 255] },
  magnet: { fill: [207, 67, 58], accent: [255, 121, 76], text: [255, 246, 222] },
  pacman: { fill: [236, 194, 61], accent: [255, 220, 102], text: [34, 28, 8] },
  stress: { fill: [142, 58, 58], accent: [199, 88, 88], text: [255, 235, 235] }
};

let pacman;
let platform;
let bricks = [];
let foods = [];
let powerups = [];
let stressors = [];
let activeStressors = [];
let gameState = "intro";
let score = 0;
let totalFood = 0;
let stressSpawnIntervalId = null;
let statusEl;
let cloneDecoy = null;
let magnetTimer = 0;

class TileSprite {
  constructor(x, y, size, assetKey, fallback) {
    this.x = x;
    this.y = y;
    this.w = size;
    this.h = size;
    this.radius = size * 0.3;
    this.assetKey = assetKey;
    this.fallback = fallback;
  }

  drawSprite() {
    const imageRef = assets[this.assetKey];
    if (imageRef && imageRef.width > 0) {
      drawSpriteTile(this.x, this.y, this.w, this.assetKey);
      image(imageRef, this.x, this.y, this.w, this.h);
      return;
    }

    push();
    noStroke();
    fill(this.fallback.fill);
    rect(this.x + 3, this.y + 3, this.w - 6, this.h - 6, 6);
    fill(this.fallback.accent);
    rect(this.x + 7, this.y + 7, this.w - 14, this.h - 14, 4);
    fill(this.fallback.text[0], this.fallback.text[1], this.fallback.text[2], 230);
    textAlign(CENTER, CENTER);
    textSize(10);
    text(this.fallback.label, this.x + this.w / 2, this.y + this.h / 2);
    pop();
  }
}

class Brick extends TileSprite {
  show() {
    this.drawSprite();
  }
}

class Food extends TileSprite {
  show() {
    this.drawSprite();
  }
}

class Powerup extends TileSprite {
  constructor(x, y, size, kind) {
    super(x, y, size, kind, fallbackBox(kind, kind === "clone" ? "C" : kind === "magnet" ? "M" : "O"));
    this.kind = kind;
  }

  show() {
    this.drawSprite();
  }
}

class CloneDecoy extends TileSprite {
  constructor(x, y, size) {
    super(x, y, size, "clone", fallbackBox("clone", "C"));
    this.timer = 90;
    this.direction = 0;
  }

  show() {
    if (frameCount % 6 < 4) this.drawSprite();
  }

  move() {
    const available = getAvailableDirections(this);
    if (available.length === 0) return;

    const nearestBurger = foods.reduce((closest, burger) => {
      if (!closest) return burger;
      return manhattanDistance(this, burger) < manhattanDistance(this, closest)
        ? burger
        : closest;
    }, null);
    const direction = nearestBurger
      ? chooseDirectionToward(this, nearestBurger, available)
      : chooseTurn(available, this.direction);
    if (direction === null) return;

    const vector = MOVE_VECTORS[direction];
    this.direction = direction;
    this.x += vector.x * platform.cellSize;
    this.y += vector.y * platform.cellSize;
    wrapActor(this);
  }
}

class Pacman extends TileSprite {
  constructor(x, y, size) {
    super(x, y, size, "pacman", {
      fill: FALLBACK_THEME.pacman.fill,
      accent: FALLBACK_THEME.pacman.accent,
      text: FALLBACK_THEME.pacman.text,
      label: "P"
    });
    this.direction = 0;
    this.previousX = x;
    this.previousY = y;
    this.isPoweredUp = false;
    this.powerupTimer = 0;
    this.powerupDuration = 90;
  }

  show() {
    const activeImage = this.isPoweredUp ? assets.pacmanPowered : assets.pacman;
    if (activeImage && activeImage.width > 0) {
      image(activeImage, this.x, this.y, this.w, this.h);
    } else {
      this.drawSprite();
    }

    if (this.isPoweredUp) {
      push();
      fill(255);
      textAlign(CENTER);
      textSize(12);
      text(ceil(this.powerupTimer / 30), this.x + this.w / 2, this.y - 6);
      pop();
    }
  }

  move(direction) {
    this.direction = direction;
    this.previousX = this.x;
    this.previousY = this.y;
    const vector = MOVE_VECTORS[direction];
    this.x += vector.x * platform.cellSize;
    this.y += vector.y * platform.cellSize;
    wrapActor(this);
  }

  overlaps(target) {
    const dx = this.x - target.x;
    const dy = this.y - target.y;
    const distanceSquared = dx * dx + dy * dy;
    const radiusSquared = (this.radius + target.radius) * (this.radius + target.radius);
    return distanceSquared < radiusSquared;
  }
}

class Stress extends TileSprite {
  constructor(x, y, size, assetKey, label, kind) {
    super(x, y, size, assetKey, {
      fill: FALLBACK_THEME.stress.fill,
      accent: FALLBACK_THEME.stress.accent,
      text: FALLBACK_THEME.stress.text,
      label
    });
    this.direction = 0;
    this.kind = kind;
    this.moveInterval = kind === "money" || kind === "read" ? 3 : 2;
    this.burgerDistractionTimer = 0;
    this.isResetting = false;
    this.startX = x;
    this.startY = y;
  }

  show() {
    if (this.isResetting || pacman.isPoweredUp) {
      tint(80, 150, 255);
      this.drawSprite();
      noTint();
      return;
    }

    this.drawSprite();
  }

  move() {
    if (this.isResetting) return;

    const direction = this.chooseDirection();
    if (direction === null) return;

    const vector = MOVE_VECTORS[direction];
    this.direction = direction;
    this.x += vector.x * platform.cellSize;
    this.y += vector.y * platform.cellSize;
    wrapActor(this);
  }

  chooseDirection() {
    const available = getAvailableDirections(this);
    if (available.length === 0) return null;

    if (this.kind === "broom") {
      return available.includes(this.direction)
        ? this.direction
        : chooseTurn(available, this.direction);
    }

    if (this.kind === "money") {
      return chooseDirectionToward(this, cloneDecoy ?? pacman, available);
    }

    if (this.kind === "fork") {
      if (this.burgerDistractionTimer > 0) {
        return chooseDirectionToward(this, pacman, available);
      }

      const nearestBurger = foods.reduce((closest, burger) => {
        if (!closest) return burger;
        const nextDistance = manhattanDistance(this, burger);
        return nextDistance < manhattanDistance(this, closest) ? burger : closest;
      }, null);
      if (nearestBurger && manhattanDistance(this, nearestBurger) <= platform.cellSize * 5) {
        return chooseDirectionToward(this, nearestBurger, available);
      }

      return chooseDirectionToward(this, pacman, available);
    }

    return chooseDirectionToward(
      this,
      cloneDecoy ?? { x: pacman.previousX, y: pacman.previousY },
      available,
    );
  }

  leave(platformRef) {
    const row = floor(this.y / platformRef.cellSize);
    const col = floor(this.x / platformRef.cellSize);
    let moveAmount = 0;

    for (let i = 1; row - i >= 0; i += 1) {
      if (platformRef.structure[row - i][col] === "d") {
        moveAmount = i;
      }
    }

    if (moveAmount > 0) {
      this.y -= platformRef.cellSize * moveAmount;
    }
  }

  reset() {
    this.isResetting = true;
  }

  moveToStart() {
    if (this.x === this.startX && this.y === this.startY) {
      this.isResetting = false;
      return;
    }

    const direction = chooseDirectionToward(
      this,
      { x: this.startX, y: this.startY },
      getAvailableDirections(this),
    );
    if (direction === null) return;

    const vector = MOVE_VECTORS[direction];
    this.x += vector.x * platform.cellSize;
    this.y += vector.y * platform.cellSize;
    wrapActor(this);
  }
}

class Platform {
  constructor() {
    this.cellSize = 30;
    this.structure = [
      ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "-", "-", "*", "*", "*", "-", "*", "*", "*", "-", "-", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
      ["*", "p", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "*"],
      ["*", "-", "*", "*", "*", "*", "*", "*", "*", "-", "*", "*", "*", "*", "*", "*", "-", "*", "*", "*", "*", "*", "*", "-", "*", "*", "*", "*", "*", "*"],
      ["*", "-", "*", "-", "-", "-", "-", "-", "*", "-", "*", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "-", "-", "*"],
      ["*", "-", "*", "-", "*", "*", "-", "-", "*", "-", "*", "-", "*", "*", "*", "-", "*", "-", "*", "*", "*", "-", "*", "-", "*", "*", "-", "-", "-", "*"],
      ["*", "-", "*", "-", "*", "*", "-", "-", "*", "-", "*", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "-", "-", "*"],
      ["*", "-", "*", "o", "-", "-", "-", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "-", "-", "-", "-", "o", "*"],
      ["*", "-", "*", "*", "*", "*", "-", "-", "*", "-", "*", "*", "*", "*", "d", "d", "d", "*", "*", "*", "*", "-", "*", "-", "-", "*", "*", "*", "*", "*"],
      ["*", "-", "-", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "*", "*", "*", "*", "*", "-", "-", "-", "-", "-", "-", "-", "-", "*", "/", "/", "*"],
      ["*", "*", "*", "*", "*", "*", "-", "*", "*", "*", "*", "*", "*", "*", "b", "/", "r", "*", "*", "*", "*", "*", "*", "*", "-", "*", "*", "*", "*", "*"],
      ["-", "-", "-", "-", "-", "-", "c", "-", "-", "-", "-", "-", "-", "*", "/", "/", "/", "*", "-", "-", "-", "-", "-", "g", "-", "-", "-", "-", "-", "-"],
      ["*", "*", "*", "*", "*", "*", "-", "*", "*", "*", "*", "*", "*", "*", "m", "/", "f", "*", "*", "*", "*", "*", "*", "*", "-", "*", "*", "*", "*", "*"],
      ["*", "-", "-", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "*", "*", "*", "*", "*", "-", "-", "-", "-", "-", "-", "-", "-", "*", "/", "/", "*"],
      ["*", "-", "*", "*", "*", "*", "-", "-", "*", "-", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "-", "*", "-", "-", "*", "*", "*", "*", "*"],
      ["*", "-", "*", "-", "-", "-", "-", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "-", "-", "-", "-", "-", "*"],
      ["*", "-", "*", "-", "*", "*", "-", "-", "*", "-", "*", "-", "*", "*", "*", "-", "*", "-", "*", "*", "*", "-", "*", "-", "*", "*", "-", "-", "-", "*"],
      ["*", "-", "*", "-", "*", "*", "-", "-", "*", "-", "*", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "-", "-", "*"],
      ["*", "-", "*", "o", "-", "-", "-", "-", "*", "-", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "-", "*", "-", "-", "-", "-", "-", "o", "*"],
      ["*", "-", "*", "*", "*", "*", "*", "*", "*", "-", "*", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "*", "-", "-", "-", "-", "-", "-", "*"],
      ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "-", "-", "*", "*", "*", "-", "*", "*", "*", "-", "-", "*", "*", "*", "*", "*", "*", "*", "*", "*"]
    ];
    this.rows = this.structure.length;
    this.cols = this.structure[0].length;
  }
}

function setup() {
  const canvas = createCanvas(900, 600);
  canvas.parent("game-canvas");
  noSmooth();
  frameRate(10);

  statusEl = document.getElementById("game-status");
  setupAssetLoads();
  bindKeyScrollBlocker();
  startNewRound();
  setStatus(STATUS.intro);
}

function draw() {
  if (!platform || !pacman) return;

  drawBackground();
  drawBoard();
  drawHud();

  if (gameState === "intro") {
    drawCenterMessage("PRESS SPACE TO START");
    return;
  }

  if (gameState === "gameOver") {
    drawCenterMessage("GAME OVER\nPRESS SPACE TO RESTART");
    return;
  }

  if (gameState === "win") {
    drawCenterMessage("YOU CLEARED THE MAP\nPRESS SPACE TO PLAY AGAIN");
    return;
  }

  updateGameplay();
}

function keyPressed() {
  if (keyCode === 32) {
    if (gameState === "intro") {
      gameState = "running";
      setStatus(STATUS.running);
      return;
    }
    if (gameState === "gameOver" || gameState === "win") {
      startNewRound();
      gameState = "running";
      setStatus(STATUS.running);
      return;
    }
  }

  if (gameState !== "running") return;

  const direction = keyToDirection(keyCode);
  if (direction === null) return;

  if (canMoveToDirection(direction)) {
    pacman.move(direction);
    resolvePlayerCollisions();
  }
}

function startNewRound() {
  platform = new Platform();
  bricks = [];
  foods = [];
  powerups = [];
  stressors = [];
  activeStressors = [];
  cloneDecoy = null;
  magnetTimer = 0;
  score = 0;
  pacman = null;

  for (let row = 0; row < platform.rows; row += 1) {
    for (let col = 0; col < platform.cols; col += 1) {
      const token = platform.structure[row][col];
      const size = platform.cellSize;
      const x = col * size;
      const y = row * size;

      if (token === "*") bricks.push(new Brick(x, y, size, "brick", fallbackBox("wall", "W")));
      if (token === "-") foods.push(new Food(x, y, size, "food", fallbackBox("food", "F")));
      if (token === "o") powerups.push(new Powerup(x, y, size, "powerup"));
      if (token === "c") powerups.push(new Powerup(x, y, size, "clone"));
      if (token === "g") powerups.push(new Powerup(x, y, size, "magnet"));
      if (token === "p") pacman = new Pacman(x, y, size);
      if (token === "b") stressors.push(new Stress(x, y, size, "broom", "B", "broom"));
      if (token === "m") stressors.push(new Stress(x, y, size, "money", "M", "money"));
      if (token === "f") stressors.push(new Stress(x, y, size, "fork", "F", "fork"));
      if (token === "r") stressors.push(new Stress(x, y, size, "read", "R", "read"));
    }
  }

  totalFood = foods.length;
  if (stressSpawnIntervalId) {
    clearInterval(stressSpawnIntervalId);
  }
  stressSpawnIntervalId = setInterval(releaseNextStressor, 2200);
}

function updateGameplay() {
  for (const stressor of activeStressors) {
    if (stressor.isResetting) {
      stressor.moveToStart();
    } else if (frameCount % stressor.moveInterval === 0) {
      stressor.move();
    }
  }

  resolveForkDistractions();
  resolvePassiveEffects();
  resolveStressorCollisions();
}

function resolveForkDistractions() {
  for (const stressor of activeStressors) {
    if (stressor.kind !== "fork") continue;

    if (stressor.burgerDistractionTimer > 0) {
      stressor.burgerDistractionTimer -= 1;
      continue;
    }

    if (foods.some((burger) => touching(stressor, burger))) {
      stressor.burgerDistractionTimer = 35;
    }
  }
}

function resolvePassiveEffects() {
  for (let i = foods.length - 1; i >= 0; i -= 1) {
    if (pacman.overlaps(foods[i])) {
      foods.splice(i, 1);
      score += 1;
    }
  }

  for (let i = powerups.length - 1; i >= 0; i -= 1) {
    if (pacman.overlaps(powerups[i])) {
      activatePowerup(powerups[i]);
      powerups.splice(i, 1);
    }
  }

  tickSpecialEffects();
  resolveCloneCollisions();

  if (foods.length === 0 && gameState === "running") {
    gameState = "win";
    setStatus(STATUS.win);
  }
}

function activatePowerup(powerup) {
  if (powerup.kind === "clone") {
    cloneDecoy = new CloneDecoy(pacman.x, pacman.y, platform.cellSize);
    setStatus(STATUS.clone);
    return;
  }

  if (powerup.kind === "magnet") {
    magnetTimer = 90;
    setStatus(STATUS.magnet);
    return;
  }

  pacman.isPoweredUp = true;
  pacman.powerupTimer = pacman.powerupDuration;
  setStatus(STATUS.powered);
}

function tickSpecialEffects() {
  let effectExpired = false;

  if (pacman.isPoweredUp) {
    pacman.powerupTimer -= 1;
    if (pacman.powerupTimer <= 0) {
      pacman.isPoweredUp = false;
      effectExpired = true;
    }
  }

  if (cloneDecoy) {
    cloneDecoy.timer -= 1;
    if (frameCount % 3 === 0) cloneDecoy.move();
    collectBurgerAt(cloneDecoy);
    if (cloneDecoy.timer <= 0) {
      cloneDecoy = null;
      effectExpired = true;
    }
  }

  if (magnetTimer > 0) {
    magnetTimer -= 1;
    attractNearbyBurgers();
    if (magnetTimer === 0) effectExpired = true;
  }

  if (effectExpired && !pacman.isPoweredUp && !cloneDecoy && magnetTimer === 0) {
    setStatus(STATUS.running);
  }
}

function attractNearbyBurgers() {
  const attractionRadius = platform.cellSize * 6;

  for (let i = foods.length - 1; i >= 0; i -= 1) {
    const burger = foods[i];
    const dx = pacman.x - burger.x;
    const dy = pacman.y - burger.y;
    if (Math.hypot(dx, dy) > attractionRadius) continue;

    burger.x += Math.sign(dx) * Math.min(6, Math.abs(dx));
    burger.y += Math.sign(dy) * Math.min(6, Math.abs(dy));

    if (pacman.overlaps(burger)) {
      foods.splice(i, 1);
      score += 1;
    }
  }
}

function collectBurgerAt(actor) {
  for (let i = foods.length - 1; i >= 0; i -= 1) {
    if (!touching(actor, foods[i])) continue;
    foods.splice(i, 1);
    score += 1;
  }
}

function resolvePlayerCollisions() {
  resolvePassiveEffects();
  resolveStressorCollisions();
}

function resolveStressorCollisions() {
  for (const stressor of activeStressors) {
    if (!touching(pacman, stressor)) continue;

    if (pacman.isPoweredUp) {
      stressor.reset();
    } else {
      gameState = "gameOver";
      setStatus(STATUS.gameOver);
      return;
    }
  }
}

function resolveCloneCollisions() {
  if (!cloneDecoy) return;

  for (const stressor of activeStressors) {
    if (!touching(cloneDecoy, stressor)) continue;
    cloneDecoy = null;
    setStatus(STATUS.cloneLost);
    return;
  }
}

function releaseNextStressor() {
  if (stressors.length === 0 || gameState === "gameOver" || gameState === "win") return;
  const next = stressors.pop();
  next.leave(platform);
  activeStressors.push(next);
}

function drawBoard() {
  for (const wall of bricks) wall.show();
  for (const food of foods) food.show();
  for (const powerup of powerups) powerup.show();
  for (const stressor of activeStressors) stressor.show();
  if (cloneDecoy) cloneDecoy.show();
  if (pacman.isPoweredUp) drawPowerAura();
  pacman.show();
}

function drawPowerAura() {
  const flicker = frameCount % 3;
  const x = pacman.x;
  const y = pacman.y;

  push();
  noStroke();
  fill(255, 170, 30, 165);
  rect(x + 4, y - 5 - flicker, 4, 5 + flicker);
  rect(x + 11, y - 10 + flicker, 4, 10 - flicker);
  rect(x + 19, y - 8 - flicker, 4, 8 + flicker);
  rect(x + 26, y - 3 + flicker, 3, 7 - flicker);
  rect(x - 4, y + 5, 4, 8);
  rect(x - 7 + flicker, y + 13, 7 - flicker, 10);
  rect(x + 32, y + 6, 4, 9);
  rect(x + 35 - flicker, y + 15, 5 + flicker, 9);
  rect(x + 2, y + 31, 6, 4);
  rect(x + 23, y + 31, 6, 4);
  fill(255, 239, 133, 235);
  rect(x + 8, y - 3, 3, 4);
  rect(x + 17, y - 6 + flicker, 3, 7 - flicker);
  rect(x + 28, y + 4, 3, 8);
  rect(x - 2, y + 10, 3, 8);
  rect(x + 5, y + 32, 4, 3);
  rect(x + 22, y + 32, 4, 3);
  pop();
}

function drawBackground() {
  background(11, 13, 27);
  push();
  stroke(27, 33, 58);
  strokeWeight(1);
  for (let x = 0; x <= width; x += platform.cellSize) line(x, 0, x, height);
  for (let y = 0; y <= height; y += platform.cellSize) line(0, y, width, y);
  pop();

  if (pacman && pacman.isPoweredUp && gameState === "running") {
    const pulse = map(sin(frameCount * 0.12), -1, 1, 8, 32);
    push();
    noStroke();
    fill(32, 104, 170, pulse);
    rect(0, 0, width, height);
    pop();
  }
}

function drawHud() {
  const hudX = width - 218;
  push();
  noStroke();
  fill(8, 10, 20, 220);
  rect(hudX + 1, 6, 212, 46);
  stroke(86, 106, 153);
  strokeWeight(2);
  noFill();
  rect(hudX + 2, 7, 210, 44);
  noStroke();
  fill(255, 241, 161);
  textAlign(LEFT, TOP);
  textSize(12);
  text(`7TH ST.  ${score}/${totalFood}`, hudX + 10, 14);
  fill(173, 214, 255);
  text(`STRESSORS  ${activeStressors.length}`, hudX + 10, 31);
  pop();
}

function drawCenterMessage(textValue) {
  push();
  noStroke();
  fill(8, 10, 20, 235);
  rect(width / 2 - 190, height / 2 - 54, 380, 108);
  noFill();
  stroke(255, 201, 40);
  strokeWeight(3);
  rect(width / 2 - 190, height / 2 - 54, 380, 108);
  fill(255, 243, 177);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(textValue, width / 2, height / 2);
  pop();
}

function drawSpriteTile(x, y, size, assetKey) {
  if (assetKey === "brick" || assetKey === "pacman" || assetKey === "pacmanPowered") return;
  push();
  noStroke();
  fill(6, 8, 17, 170);
  rect(x + 3, y + 4, size - 6, size - 5);
  pop();
}

function canMoveToDirection(direction) {
  const row = floor(pacman.y / platform.cellSize);
  const col = floor(pacman.x / platform.cellSize);
  const vector = MOVE_VECTORS[direction];
  const nextRow = row + vector.y;
  const nextCol = col + vector.x;

  if (nextRow < 0 || nextRow >= platform.rows || nextCol < 0 || nextCol >= platform.cols) {
    return true;
  }

  return platform.structure[nextRow][nextCol] !== "*";
}

function getAvailableDirections(actor) {
  const row = floor(actor.y / platform.cellSize);
  const col = floor(actor.x / platform.cellSize);

  return MOVE_VECTORS.flatMap((vector, direction) => {
    const nextRow = (row + vector.y + platform.rows) % platform.rows;
    const nextCol = (col + vector.x + platform.cols) % platform.cols;
    return platform.structure[nextRow][nextCol] === "*" ? [] : [direction];
  });
}

function chooseTurn(available, currentDirection) {
  const reverse = (currentDirection + 2) % MOVE_VECTORS.length;
  const forwardOptions = available.filter((direction) => direction !== reverse);
  const choices = forwardOptions.length > 0 ? forwardOptions : available;
  return choices[floor(random(choices.length))];
}

function chooseDirectionToward(actor, target, available) {
  return available.reduce((bestDirection, direction) => {
    if (bestDirection === null) return direction;

    const bestVector = MOVE_VECTORS[bestDirection];
    const nextVector = MOVE_VECTORS[direction];
    const bestDistance = Math.abs(actor.x + bestVector.x * platform.cellSize - target.x)
      + Math.abs(actor.y + bestVector.y * platform.cellSize - target.y);
    const nextDistance = Math.abs(actor.x + nextVector.x * platform.cellSize - target.x)
      + Math.abs(actor.y + nextVector.y * platform.cellSize - target.y);

    if (nextDistance < bestDistance) return direction;
    if (nextDistance === bestDistance && direction === actor.direction) return direction;
    return bestDirection;
  }, null);
}

function manhattanDistance(first, second) {
  return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
}

function keyToDirection(keyCodeValue) {
  if (keyCodeValue === RIGHT_ARROW) return 0;
  if (keyCodeValue === DOWN_ARROW) return 1;
  if (keyCodeValue === LEFT_ARROW) return 2;
  if (keyCodeValue === UP_ARROW) return 3;
  return null;
}

function touching(a, b) {
  const distanceBetween = dist(
    a.x + a.w / 2,
    a.y + a.h / 2,
    b.x + b.w / 2,
    b.y + b.h / 2
  );
  return distanceBetween < a.radius + b.radius;
}

function wrapActor(actor) {
  if (actor.x < 0) actor.x = width - platform.cellSize;
  if (actor.x >= width) actor.x = 0;
  if (actor.y < 0) actor.y = height - platform.cellSize;
  if (actor.y >= height) actor.y = 0;
}

function bindKeyScrollBlocker() {
  window.addEventListener("keydown", (event) => {
    if ([32, 37, 38, 39, 40].includes(event.keyCode)) {
      event.preventDefault();
    }
  });
}

function setStatus(message) {
  if (statusEl) {
    statusEl.textContent = message;
  }
}

function setupAssetLoads() {
  for (const [key, path] of Object.entries(ASSET_PATHS)) {
    loadImage(
      path,
      (img) => {
        assets[key] = img;
      },
      () => {
        assets[key] = null;
      }
    );
  }
}

function fallbackBox(kind, label) {
  const theme = FALLBACK_THEME[kind] ?? FALLBACK_THEME.wall;
  return {
    fill: theme.fill,
    accent: theme.accent,
    text: theme.text,
    label
  };
}
