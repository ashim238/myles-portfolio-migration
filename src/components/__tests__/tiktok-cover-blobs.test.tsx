import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  TikTokCoverBlobs,
  TikTokTemplateSystem,
} from "@/components/tiktok-dsa";

const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);

afterEach(() => {
  vi.unstubAllGlobals();
  delete (document as unknown as { visibilityState?: string }).visibilityState;
});

function numericCustomProperty(
  node: HTMLElement,
  property: string,
): number {
  return Number.parseFloat(node.style.getPropertyValue(property));
}

function keyframesBlock(name: string): string {
  const start = baseStyles.indexOf(`@keyframes ${name}`);
  const end = baseStyles.indexOf("\n}\n", start);
  return start >= 0 && end >= 0 ? baseStyles.slice(start, end + 2) : "";
}

function translateDistance(block: string): number {
  return Math.max(
    ...Array.from(
      block.matchAll(/translate3d\(\s*(-?[\d.]+)px,\s*(-?[\d.]+)px/gu),
      (match) => Math.hypot(Number(match[1]), Number(match[2])),
    ),
  );
}

describe("TikTokCoverBlobs preview geometry", () => {
  it("server-renders one lightweight field without requesting blob layers", () => {
    const markup = renderToStaticMarkup(<TikTokCoverBlobs />);

    expect(markup.match(/class="tt-cover-field(?:\s|")/g)).toHaveLength(1);
    expect(markup).toContain("tt-cover-cluster");
    expect(markup).toContain("tt-cover-poster");
    expect(markup).toContain("tt-logo");
    expect(markup).not.toContain("/projects/tiktok/cover-blobs/");
  });

  it("loads layers near the viewport but only animates while actually visible", () => {
    const observers = new Map<string, IntersectionObserverCallback>();
    const observe = vi.fn();
    const disconnect = vi.fn();
    class MockIntersectionObserver {
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        this.rootMargin = options?.rootMargin ?? "0px";
        observers.set(this.rootMargin, callback);
      }

      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
      takeRecords = () => [];
      root = null;
      rootMargin: string;
      thresholds = [0];
    }

    vi.stubGlobal(
      "IntersectionObserver",
      MockIntersectionObserver as unknown as typeof IntersectionObserver,
    );
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });

    const { container } = render(<TikTokCoverBlobs />);
    const field = container.querySelector(".tt-cover-field");

    expect(observe).toHaveBeenCalledTimes(2);
    expect(observers.has("600px 0px")).toBe(true);
    expect(observers.has("0px")).toBe(true);
    expect(container.querySelectorAll(".tt-cblob")).toHaveLength(0);
    expect(field).not.toHaveClass("tt-cover-field--active");

    act(() => {
      observers.get("600px 0px")?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(container.querySelectorAll(".tt-cblob")).toHaveLength(16);
    expect(field).not.toHaveClass("tt-cover-field--active");

    act(() => {
      observers.get("0px")?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(field).toHaveClass("tt-cover-field--active");
    for (const layer of container.querySelectorAll(".tt-cblob")) {
      expect(layer).toHaveAttribute("loading", "lazy");
      expect(layer).toHaveAttribute("fetchpriority", "low");
    }

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value: "hidden",
      });
      fireEvent(document, new Event("visibilitychange"));
    });

    expect(field).not.toHaveClass("tt-cover-field--active");

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value: "visible",
      });
      fireEvent(document, new Event("visibilitychange"));
    });

    expect(field).toHaveClass("tt-cover-field--active");

    act(() => {
      observers.get("0px")?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(container.querySelectorAll(".tt-cblob")).toHaveLength(16);
    expect(field).not.toHaveClass("tt-cover-field--active");
  });

  it("loads a static composition without running motion when observers are unavailable", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    const { container } = render(<TikTokCoverBlobs />);
    const field = container.querySelector(".tt-cover-field");

    await waitFor(() => {
      expect(container.querySelectorAll(".tt-cblob")).toHaveLength(16);
    });
    expect(field).not.toHaveClass("tt-cover-field--active");
  });

  it("keeps the recognizable poster when even one required layer fails", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    const { container } = render(<TikTokCoverBlobs />);
    await waitFor(() => {
      expect(
        container.querySelectorAll<HTMLImageElement>(".tt-cblob"),
      ).toHaveLength(16);
    });

    const layers = Array.from(
      container.querySelectorAll<HTMLImageElement>(".tt-cblob"),
    );
    for (const layer of layers.slice(0, -1)) fireEvent.load(layer);
    fireEvent.error(layers.at(-1)!);

    expect(container.querySelector(".tt-cover-poster")).not.toHaveClass(
      "tt-cover-poster--hidden",
    );
  });

  it("keeps the recognizable poster when every required layer fails", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    const { container } = render(<TikTokCoverBlobs />);
    await waitFor(() => {
      expect(
        container.querySelectorAll<HTMLImageElement>(".tt-cblob"),
      ).toHaveLength(16);
    });

    for (const layer of container.querySelectorAll<HTMLImageElement>(
      ".tt-cblob",
    )) {
      fireEvent.error(layer);
    }

    expect(container.querySelector(".tt-cover-poster")).not.toHaveClass(
      "tt-cover-poster--hidden",
    );
  });

  it("hands off from the poster only after every required layer loads successfully", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    const { container } = render(<TikTokCoverBlobs />);
    await waitFor(() => {
      expect(
        container.querySelectorAll<HTMLImageElement>(".tt-cblob"),
      ).toHaveLength(16);
    });

    const layers = Array.from(
      container.querySelectorAll<HTMLImageElement>(".tt-cblob"),
    );
    for (const layer of layers.slice(0, -1)) fireEvent.load(layer);
    expect(container.querySelector(".tt-cover-poster")).not.toHaveClass(
      "tt-cover-poster--hidden",
    );

    fireEvent.load(layers.at(-1)!);
    expect(container.querySelector(".tt-cover-poster")).toHaveClass(
      "tt-cover-poster--hidden",
    );
  });

  it("falls back to a loaded paused composition when observer construction fails", async () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class ThrowingIntersectionObserver {
        constructor() {
          throw new Error("observer construction failed");
        }
      } as unknown as typeof IntersectionObserver,
    );

    const { container } = render(<TikTokCoverBlobs />);

    await waitFor(() => {
      expect(container.querySelectorAll(".tt-cblob")).toHaveLength(16);
    });
    expect(container.querySelector(".tt-cover-field")).not.toHaveClass(
      "tt-cover-field--active",
    );
  });

  it("falls back to a loaded paused composition when observer registration fails", async () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class ThrowingObserveIntersectionObserver {
        observe() {
          throw new Error("observer registration failed");
        }
        disconnect() {}
      } as unknown as typeof IntersectionObserver,
    );

    const { container } = render(<TikTokCoverBlobs />);

    await waitFor(() => {
      expect(container.querySelectorAll(".tt-cblob")).toHaveLength(16);
    });
    expect(container.querySelector(".tt-cover-field")).not.toHaveClass(
      "tt-cover-field--active",
    );
  });

  it("keeps every below-fold template image lazy", () => {
    const { container } = render(<TikTokTemplateSystem />);

    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) {
      expect(image).toHaveAttribute("loading", "lazy");
    }
  });

  it("lets the pieces micro-drift independently without distorting the logo", () => {
    const { container } = render(<TikTokCoverBlobs />);
    const cluster = container.querySelector(".tt-cover-cluster");

    expect(cluster).not.toBeNull();
    expect(cluster?.querySelectorAll(".tt-cblob")).toHaveLength(16);
    expect(baseStyles).toMatch(
      /\.tt-cover--preview \.tt-cblob\s*\{[\s\S]*?animation-duration: calc\(var\(--d\) \* 0\.45\)[\s\S]*?animation-direction: alternate/,
    );
    for (let variant = 1; variant <= 6; variant += 1) {
      expect(baseStyles).toMatch(
        new RegExp(
          `\\.tt-cover--preview \\.tt-cblob--a${variant}\\s*\\{[\\s\\S]*?animation-name: tt-preview-piece-a${variant}`,
        ),
      );
      const motion = keyframesBlock(`tt-preview-piece-a${variant}`);
      expect(motion).toContain("translate3d(");
      expect(motion).not.toMatch(/rotate|scale|vw/);
      expect(translateDistance(motion)).toBeGreaterThanOrEqual(5.5);
      expect(translateDistance(motion)).toBeLessThanOrEqual(7.5);
    }

    const normalizedPhases = Array.from(
      container.querySelectorAll<HTMLElement>(".tt-cblob"),
      (piece) => {
        const duration = Number.parseFloat(
          piece.style.getPropertyValue("--d"),
        );
        return (
          Number.parseFloat(
            piece.style.getPropertyValue("--tt-preview-delay"),
          ) / duration
        );
      },
    );
    expect(new Set(normalizedPhases.map((phase) => phase.toFixed(2))).size).toBeGreaterThanOrEqual(5);
  });

  it("keeps the desktop stem open and the right satellite close enough to read as one mark", () => {
    const { container } = render(<TikTokCoverBlobs />);
    const topStem = container.querySelector<HTMLImageElement>(
      'img[src$="/b00.png"]',
    );
    const bottomStem = container.querySelector<HTMLImageElement>(
      'img[src$="/b12.png"]',
    );
    const rightSatellite = container.querySelector<HTMLImageElement>(
      'img[src$="/b10.png"]',
    );

    expect(topStem).not.toBeNull();
    expect(bottomStem).not.toBeNull();
    expect(rightSatellite).not.toBeNull();
    expect(numericCustomProperty(topStem!, "--tt-preview-y")).toBeCloseTo(
      7.31,
      2,
    );
    expect(numericCustomProperty(bottomStem!, "--tt-preview-y")).toBeCloseTo(
      65.91,
      2,
    );
    expect(
      numericCustomProperty(rightSatellite!, "--tt-preview-x"),
    ).toBeLessThan(78);
  });

  it("provides a mobile composition with separate horizontal and vertical spreads", () => {
    const { container } = render(<TikTokCoverBlobs />);
    const topStem = container.querySelector<HTMLImageElement>(
      'img[src$="/b00.png"]',
    );
    const bottomStem = container.querySelector<HTMLImageElement>(
      'img[src$="/b12.png"]',
    );
    const rightSatellite = container.querySelector<HTMLImageElement>(
      'img[src$="/b10.png"]',
    );

    expect(numericCustomProperty(topStem!, "--tt-preview-mobile-y")).toBeCloseTo(
      6.32,
      2,
    );
    expect(
      numericCustomProperty(bottomStem!, "--tt-preview-mobile-y"),
    ).toBeCloseTo(61.75, 2);
    expect(
      numericCustomProperty(rightSatellite!, "--tt-preview-mobile-x"),
    ).toBeCloseTo(75.36, 2);
  });
});
