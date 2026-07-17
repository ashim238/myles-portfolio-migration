const FRAME = {
  margin: 0.05,
  barWidth: 0.9,
  thinBarHeight: 0.02,
  thickBarHeight: 0.04,
  topY: 0.225,
  centerUpperY: 0.485,
  centerLowerY: 0.515,
  bottomY: 0.775,
  pillarWidth: 0.02,
  pillarHeight: 0.59,
  roundness: 5,
  pointCount: 20,
  pointRadius: 2
};

const COLORS = {
  background: [245, 243, 239],
  frame: [213, 176, 124],
  frameDark: [206, 164, 120],
  shadow: [0, 0, 0, 20],
  point: [50, 50, 50]
};

const MAX_THREADS = 140;
const THREADS_PER_RESPONSE = 5;

let topPoints = [];
let bottomPoints = [];
let strings = [];

let inputEl;
let weaveButtonEl;
let clearButtonEl;
let statusEl;

// p5 discovers this callback by global name.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setup() {
  const host = document.getElementById("loom-canvas");
  const canvasWidth = getCanvasWidth();
  const canvasHeight = getCanvasHeight(canvasWidth);
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(host);

  bindControls();
  recalculateLoomPoints();
  updateStatus("No threads yet.");
}

// p5 discovers this callback by global name.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function draw() {
  background(...COLORS.background);
  drawPillars();
  drawHorizontalBars();
  drawStrings();
  drawPoints();
  drawLegend();
}

// p5 discovers this callback by global name.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function windowResized() {
  const canvasWidth = getCanvasWidth();
  const canvasHeight = getCanvasHeight(canvasWidth);
  resizeCanvas(canvasWidth, canvasHeight);
  recalculateLoomPoints();
}

function getCanvasWidth() {
  const host = document.getElementById("loom-canvas");
  if (!host) return 960;
  return max(320, min(1100, host.clientWidth - 8));
}

function getCanvasHeight(canvasWidth) {
  return floor(canvasWidth * 0.66);
}

function bindControls() {
  inputEl = document.getElementById("joy-input");
  weaveButtonEl = document.getElementById("weave-button");
  clearButtonEl = document.getElementById("clear-button");
  statusEl = document.getElementById("status");

  if (!inputEl || !weaveButtonEl || !clearButtonEl || !statusEl) return;

  weaveButtonEl.addEventListener("click", addThreadFromInput);
  clearButtonEl.addEventListener("click", clearThreads);
  inputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addThreadFromInput();
    }
  });
}

function addThreadFromInput() {
  if (!inputEl) return;

  const answer = inputEl.value.trim();
  if (!answer) {
    updateStatus("Please enter a response before weaving.");
    return;
  }

  weaveAnswer(answer);
  inputEl.value = "";
  updateStatus(`Woven ${strings.length} thread${strings.length === 1 ? "" : "s"} so far.`);
}

function clearThreads() {
  strings = [];
  updateStatus("Cleared. Start weaving a new composition.");
}

function weaveAnswer(answer) {
  const seed = hashString(answer);
  randomSeed(seed);

  for (let i = 0; i < THREADS_PER_RESPONSE; i += 1) {
    const topIndex = floor(random(topPoints.length));
    const bottomIndex = floor(random(bottomPoints.length));
    const baseHue = (seed + i * 27) % 360;

    strings.push({
      start: topPoints[topIndex],
      end: bottomPoints[bottomIndex],
      alpha: random(85, 170),
      weight: random(0.9, 2.2),
      hue: baseHue
    });
  }

  if (strings.length > MAX_THREADS) {
    strings.splice(0, strings.length - MAX_THREADS);
  }
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return abs(hash);
}

function recalculateLoomPoints() {
  const spacing = (width * FRAME.barWidth) / (FRAME.pointCount + 1);
  const startX = width * FRAME.margin + spacing;

  topPoints = [];
  bottomPoints = [];

  for (let i = 0; i < FRAME.pointCount; i += 1) {
    topPoints.push({
      x: startX + spacing * i,
      y: height * FRAME.topY
    });

    bottomPoints.push({
      x: startX + spacing * i,
      y: height * FRAME.bottomY + height * FRAME.thickBarHeight
    });
  }
}

function drawHorizontalBars() {
  noStroke();

  fill(...COLORS.frameDark);
  rect(
    width * FRAME.margin,
    height * FRAME.topY,
    width * FRAME.barWidth,
    height * FRAME.thickBarHeight,
    FRAME.roundness
  );

  fill(...COLORS.shadow);
  rect(
    width * FRAME.margin + (width * FRAME.pillarWidth) / 2,
    height * FRAME.topY + (height * FRAME.thickBarHeight) / 2,
    width * FRAME.barWidth - width * FRAME.pillarWidth,
    (height * FRAME.thickBarHeight) / 2
  );

  fill(...COLORS.frame);
  rect(
    width * FRAME.margin,
    height * FRAME.centerUpperY,
    width * FRAME.barWidth,
    height * FRAME.thinBarHeight,
    FRAME.roundness
  );

  rect(
    width * FRAME.margin,
    height * FRAME.centerLowerY,
    width * FRAME.barWidth,
    height * FRAME.thinBarHeight,
    FRAME.roundness
  );

  fill(...COLORS.frameDark);
  rect(
    width * FRAME.margin,
    height * FRAME.bottomY,
    width * FRAME.barWidth,
    height * FRAME.thickBarHeight,
    FRAME.roundness
  );

  fill(...COLORS.shadow);
  rect(
    width * FRAME.margin + (width * FRAME.pillarWidth) / 2,
    height * FRAME.bottomY,
    width * FRAME.barWidth - width * FRAME.pillarWidth,
    (height * FRAME.thickBarHeight) / 2
  );
}

function drawPillars() {
  const leftPillarX = width * FRAME.margin;
  const rightPillarX = width * (1 - FRAME.margin - FRAME.pillarWidth);
  const pillarY = height * FRAME.topY;
  const pillarHeight = height * FRAME.pillarHeight;
  const pillarWidth = width * FRAME.pillarWidth;

  fill(...COLORS.frame);
  rect(leftPillarX, pillarY, pillarWidth, pillarHeight, FRAME.roundness);
  rect(rightPillarX, pillarY, pillarWidth, pillarHeight, FRAME.roundness);

  fill(...COLORS.shadow);
  rect(leftPillarX + pillarWidth / 2, pillarY, pillarWidth / 2, pillarHeight, FRAME.roundness);
  rect(rightPillarX, pillarY, pillarWidth / 2, pillarHeight, FRAME.roundness);
}

function drawStrings() {
  colorMode(HSL, 360, 100, 100, 255);
  for (const thread of strings) {
    stroke(thread.hue, 50, 35, thread.alpha);
    strokeWeight(thread.weight);
    line(thread.start.x, thread.start.y, thread.end.x, thread.end.y);
  }
  colorMode(RGB, 255, 255, 255, 255);
}

function drawPoints() {
  fill(...COLORS.point);
  noStroke();

  for (const point of topPoints) {
    circle(point.x, point.y, FRAME.pointRadius * 2);
  }
  for (const point of bottomPoints) {
    circle(point.x, point.y, FRAME.pointRadius * 2);
  }
}

function drawLegend() {
  noStroke();
  fill(40, 40, 40, 170);
  textSize(max(14, width * 0.016));
  textAlign(LEFT, TOP);
  text("Each response adds a new set of woven threads.", width * 0.06, height * 0.06);
}

function updateStatus(message) {
  if (statusEl) {
    statusEl.textContent = message;
  }
}
