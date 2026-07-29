import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";

type ThreadSnapshot = {
  start: { x: number; y: number };
  end: { x: number; y: number };
  alpha: number;
  weight: number;
  hue: number;
};

type LoomTestApi = {
  setup: () => void;
  windowResized: () => void;
  addThreadFromInput: () => void;
  clearThreads: () => void;
  getThreads: () => ThreadSnapshot[];
};

function relativeLuminance(hex: string) {
  const [red, green, blue] =
    hex
      .match(/[0-9a-f]{2}/gi)
      ?.map((channel) => Number.parseInt(channel, 16) / 255)
      .map((channel) =>
        channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4,
      ) ?? [];

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: string, second: string) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);

  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

function createLoomHarness() {
  document.body.innerHTML = `
    <input id="joy-input" />
    <button id="weave-button">Weave</button>
    <button id="clear-button">Clear</button>
    <p id="status"></p>
    <div id="loom-canvas" role="img"></div>
  `;

  const source = readFileSync(
    resolve(process.cwd(), "public/play/loom/sketch.js"),
    "utf8",
  );
  const executable = `${source}
globalThis.__loomTestApi = {
  setup,
  windowResized,
  addThreadFromInput,
  clearThreads,
  getThreads: () => strings.map((thread) => ({
    start: { ...thread.start },
    end: { ...thread.end },
    alpha: thread.alpha,
    weight: thread.weight,
    hue: thread.hue,
  })),
};`;
  const noLoop = vi.fn();
  const redraw = vi.fn();
  let randomState = 1;

  const context: Record<string, unknown> = {
    document,
    width: 0,
    height: 0,
    HSL: "HSL",
    RGB: "RGB",
    LEFT: "LEFT",
    TOP: "TOP",
    noLoop,
    redraw,
    createCanvas: (canvasWidth: number, canvasHeight: number) => {
      context.width = canvasWidth;
      context.height = canvasHeight;
      return { parent: vi.fn() };
    },
    resizeCanvas: (canvasWidth: number, canvasHeight: number) => {
      context.width = canvasWidth;
      context.height = canvasHeight;
    },
    randomSeed: (seed: number) => {
      randomState = seed >>> 0;
    },
    random: (minimumOrMaximum: number, maximum?: number) => {
      randomState = (randomState * 1664525 + 1013904223) >>> 0;
      const unit = randomState / 0x100000000;
      return maximum === undefined
        ? unit * minimumOrMaximum
        : minimumOrMaximum + unit * (maximum - minimumOrMaximum);
    },
    floor: Math.floor,
    abs: Math.abs,
    max: Math.max,
    min: Math.min,
    background: vi.fn(),
    noStroke: vi.fn(),
    fill: vi.fn(),
    rect: vi.fn(),
    stroke: vi.fn(),
    strokeWeight: vi.fn(),
    line: vi.fn(),
    colorMode: vi.fn(),
    circle: vi.fn(),
    textSize: vi.fn(),
    textAlign: vi.fn(),
    text: vi.fn(),
  };

  runInNewContext(executable, context);

  return {
    api: context.__loomTestApi as LoomTestApi,
    artwork: document.getElementById("loom-canvas") as HTMLElement,
    input: document.getElementById("joy-input") as HTMLInputElement,
    noLoop,
    redraw,
    status: document.getElementById("status") as HTMLElement,
  };
}

describe("Loom p5 behavior", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("redraws only for approved state changes and keeps feedback synchronized", () => {
    const { api, artwork, input, noLoop, redraw, status } =
      createLoomHarness();

    api.setup();
    expect(noLoop).toHaveBeenCalledTimes(1);
    expect(redraw).toHaveBeenCalledTimes(1);
    expect(artwork).toHaveAttribute(
      "aria-label",
      "Generative loom artwork with no woven threads.",
    );

    input.value = "cooking for friends";
    api.addThreadFromInput();
    const firstPattern = api.getThreads();
    expect(firstPattern).toHaveLength(5);
    expect(redraw).toHaveBeenCalledTimes(2);
    expect(status).toHaveTextContent("Woven 5 threads so far.");
    expect(artwork).toHaveAttribute(
      "aria-label",
      "Generative loom artwork with 5 woven threads.",
    );

    api.clearThreads();
    expect(api.getThreads()).toHaveLength(0);
    expect(redraw).toHaveBeenCalledTimes(3);
    expect(status).toHaveTextContent(
      "Cleared. Start weaving a new composition.",
    );
    expect(artwork).toHaveAttribute(
      "aria-label",
      "Generative loom artwork with no woven threads.",
    );

    input.value = "cooking for friends";
    api.addThreadFromInput();
    expect(api.getThreads()).toEqual(firstPattern);

    input.value = "   ";
    const redrawCount = redraw.mock.calls.length;
    api.addThreadFromInput();
    expect(redraw).toHaveBeenCalledTimes(redrawCount);

    api.windowResized();
    expect(redraw).toHaveBeenCalledTimes(redrawCount + 1);
  });

  it("keeps the real-script thread collection at the 140-thread cap", () => {
    const { api, input } = createLoomHarness();

    api.setup();
    for (let index = 0; index < 29; index += 1) {
      input.value = `response ${index}`;
      api.addThreadFromInput();
    }

    expect(api.getThreads()).toHaveLength(140);
  });

  it("gives the shared input and button rule a 44px minimum height", () => {
    const css = readFileSync(
      resolve(process.cwd(), "public/play/loom/style.css"),
      "utf8",
    );
    const sharedControlRule =
      css.match(/input,\s*button\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(sharedControlRule).toMatch(/min-height:\s*44px/);
  });

  it("lets the canvas use its responsive height on narrow screens", () => {
    const css = readFileSync(
      resolve(process.cwd(), "public/play/loom/style.css"),
      "utf8",
    );
    const mobileRules =
      css.match(/@media \(max-width: 600px\)\s*\{([\s\S]*)\}\s*$/)?.[1] ??
      "";

    expect(mobileRules).toMatch(
      /#loom-canvas\s*\{[^}]*min-height:\s*0[^}]*\}/,
    );
  });

  it("keeps dark-theme button text at normal-text contrast", () => {
    const css = readFileSync(
      resolve(process.cwd(), "public/play/loom/style.css"),
      "utf8",
    );
    const darkTheme =
      css.match(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/)?.[1] ?? "";
    const button = darkTheme.match(/--loom-button:\s*(#[0-9a-f]{6})/i)?.[1];
    const hover = darkTheme.match(
      /--loom-button-hover:\s*(#[0-9a-f]{6})/i,
    )?.[1];

    expect(button).toBeDefined();
    expect(hover).toBeDefined();
    expect(contrastRatio("#ffffff", button!)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#ffffff", hover!)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the dark-theme input boundary at non-text contrast", () => {
    const css = readFileSync(
      resolve(process.cwd(), "public/play/loom/style.css"),
      "utf8",
    );
    const darkTheme =
      css.match(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/)?.[1] ?? "";
    const panel = darkTheme.match(/--loom-panel:\s*(#[0-9a-f]{6})/i)?.[1];
    const input = darkTheme.match(/--loom-input:\s*(#[0-9a-f]{6})/i)?.[1];
    const border = darkTheme.match(/--loom-border:\s*(#[0-9a-f]{6})/i)?.[1];

    expect(panel).toBeDefined();
    expect(input).toBeDefined();
    expect(border).toBeDefined();
    expect(contrastRatio(border!, panel!)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(border!, input!)).toBeGreaterThanOrEqual(3);
  });
});
