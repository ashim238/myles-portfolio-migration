import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollRevealFallback } from "@/components/scroll-reveal-fallback";

const lateStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/late-polish.css"),
  "utf8",
);

describe("ScrollRevealFallback", () => {
  beforeEach(() => {
    vi.stubGlobal("CSS", { supports: vi.fn(() => false) });
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Reflect.deleteProperty(window, "IntersectionObserver");
    delete document.documentElement.dataset.revealReady;
  });

  afterEach(() => {
    delete document.documentElement.dataset.revealReady;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("leaves reveal targets visible when IntersectionObserver is unavailable", () => {
    expect(() =>
      render(
        <>
          <div className="play-entry">Visible content</div>
          <ScrollRevealFallback />
        </>,
      ),
    ).not.toThrow();

    expect(document.documentElement).not.toHaveAttribute("data-reveal-ready");
  });

  it("marks reveal enhancement ready only after observer setup succeeds", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class MockIntersectionObserver {
        observe = observe;
        unobserve = vi.fn();
        disconnect = disconnect;
      },
    );

    const { getByText, unmount } = render(
      <>
        <div className="play-entry">Observed content</div>
        <ScrollRevealFallback />
      </>,
    );

    expect(document.documentElement).toHaveAttribute(
      "data-reveal-ready",
      "true",
    );
    expect(observe).toHaveBeenCalledWith(getByText("Observed content"));

    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(document.documentElement).not.toHaveAttribute("data-reveal-ready");
  });

  it("keeps reveal targets visible when the observer cannot be constructed", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class ThrowingIntersectionObserver {
        constructor() {
          throw new Error("observer construction failed");
        }
      },
    );

    expect(() =>
      render(
        <>
          <div className="play-entry">Still visible</div>
          <ScrollRevealFallback />
        </>,
      ),
    ).not.toThrow();
    expect(document.documentElement).not.toHaveAttribute("data-reveal-ready");
  });

  it("keeps reveal targets visible when observation setup fails", () => {
    const disconnect = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class ThrowingObserveIntersectionObserver {
        observe() {
          throw new Error("observe failed");
        }
        unobserve = vi.fn();
        disconnect = disconnect;
      },
    );

    expect(() =>
      render(
        <>
          <div className="play-entry">Visible after setup failure</div>
          <ScrollRevealFallback />
        </>,
      ),
    ).not.toThrow();
    expect(document.documentElement).not.toHaveAttribute("data-reveal-ready");
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("hides fallback targets only after reveal enhancement is ready", () => {
    expect(lateStyles).toMatch(
      /html\[data-reveal-ready="true"\]\s+:is\([\s\S]*?\.project-highlight[\s\S]*?\.nv-persona-grid > \*[\s\S]*?\)\s*\{\s*opacity:\s*0;/,
    );
  });
});
