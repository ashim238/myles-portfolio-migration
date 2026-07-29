import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

function executeBridge() {
  const source = readFileSync(
    resolve(process.cwd(), "public/play/loom/embed-bridge.js"),
    "utf8",
  );
  const listeners = new Map<string, EventListener>();
  const postMessage = vi.fn();
  const parentWindow = { postMessage };
  let rootRectHeight = 640;
  const root = {
    dataset: {} as Record<string, string>,
    scrollHeight: 640,
    getBoundingClientRect: () => ({ height: rootRectHeight }),
  };
  const body = { scrollHeight: 620 };
  const observedTargets: unknown[] = [];
  let resizeCallback: ResizeObserverCallback | undefined;

  runInNewContext(source, {
    window: {
      parent: parentWindow,
      location: { origin: "https://portfolio.test" },
      matchMedia: () => ({
        matches: false,
        addEventListener: vi.fn(),
      }),
      addEventListener: (type: string, listener: EventListener) => {
        listeners.set(type, listener);
      },
    },
    document: {
      documentElement: root,
      body,
    },
    ResizeObserver: class {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }

      observe = (target: unknown) => {
        observedTargets.push(target);
      };
    },
    Math,
  });

  return {
    listeners,
    parentWindow,
    postMessage,
    resize: (documentHeight: number, contentHeight = documentHeight) => {
      root.scrollHeight = documentHeight;
      rootRectHeight = contentHeight;
      body.scrollHeight = contentHeight;
      resizeCallback?.([], {} as ResizeObserver);
    },
    body,
    observedTargets,
    root,
  };
}

describe("Loom child embed bridge", () => {
  it("reports height and accepts themes only from its same-origin parent", () => {
    const {
      body,
      listeners,
      observedTargets,
      parentWindow,
      postMessage,
      resize,
      root,
    } =
      executeBridge();

    expect(observedTargets).toEqual([root, body]);

    listeners.get("load")?.({} as Event);
    expect(postMessage).toHaveBeenCalledWith(
      { type: "loom:resize", height: 640 },
      "https://portfolio.test",
    );

    const resizeCountBeforeTheme = postMessage.mock.calls.length;
    listeners.get("message")?.({
      origin: "https://portfolio.test",
      source: parentWindow,
      data: { type: "loom:theme", theme: "dark" },
    } as unknown as MessageEvent);
    expect(root.dataset.theme).toBe("dark");
    expect(postMessage).toHaveBeenCalledTimes(resizeCountBeforeTheme + 1);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "loom:resize", height: 640 },
      "https://portfolio.test",
    );

    for (const message of [
      {
        origin: "https://invalid.example",
        source: parentWindow,
        data: { type: "loom:theme", theme: "light" },
      },
      {
        origin: "https://portfolio.test",
        source: {},
        data: { type: "loom:theme", theme: "light" },
      },
      {
        origin: "https://portfolio.test",
        source: parentWindow,
        data: { type: "loom:theme", theme: "sepia" },
      },
    ]) {
      listeners.get("message")?.(message as unknown as MessageEvent);
      expect(root.dataset.theme).toBe("dark");
    }

    resize(734);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "loom:resize", height: 734 },
      "https://portfolio.test",
    );

    resize(932, 821);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "loom:resize", height: 821 },
      "https://portfolio.test",
    );
  });

  it("loads the child bridge before the p5 sketch", () => {
    const html = readFileSync(
      resolve(process.cwd(), "public/play/loom/index.html"),
      "utf8",
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const scripts = Array.from(
      document.querySelectorAll<HTMLScriptElement>("script[src]"),
      (script) => script.getAttribute("src"),
    );

    expect(scripts.indexOf("embed-bridge.js")).toBeGreaterThan(-1);
    expect(scripts.indexOf("embed-bridge.js")).toBeLessThan(
      scripts.indexOf("sketch.js"),
    );
  });
});
