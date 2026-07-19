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

  it("observes reveal targets added after client navigation", async () => {
    const observe = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class MockIntersectionObserver {
        observe = observe;
        unobserve = vi.fn();
        disconnect = vi.fn();
      },
    );

    const { container } = render(<ScrollRevealFallback />);

    const lateTarget = document.createElement("div");
    lateTarget.className = "play-entry";
    lateTarget.textContent = "Added by client navigation";
    container.append(lateTarget);

    await vi.waitFor(() => {
      expect(observe).toHaveBeenCalledWith(lateTarget);
    });

    lateTarget.remove();
  });

  it("unobserves removed reveal targets and matching descendants", async () => {
    const observe = vi.fn();
    const unobserve = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class MockIntersectionObserver {
        observe = observe;
        unobserve = unobserve;
        disconnect = vi.fn();
      },
    );

    const { container } = render(<ScrollRevealFallback />);
    const removedTree = document.createElement("article");
    removedTree.className = "play-entry";
    const removedDescendant = document.createElement("div");
    removedDescendant.className = "project-highlight";
    removedTree.append(removedDescendant);
    container.append(removedTree);

    await vi.waitFor(() => {
      expect(observe).toHaveBeenCalledWith(removedTree);
      expect(observe).toHaveBeenCalledWith(removedDescendant);
    });

    unobserve.mockClear();
    removedTree.remove();

    await vi.waitFor(() => {
      expect(unobserve).toHaveBeenCalledWith(removedTree);
      expect(unobserve).toHaveBeenCalledWith(removedDescendant);
    });
    expect(document.documentElement).toHaveAttribute(
      "data-reveal-ready",
      "true",
    );
  });

  it("removes global hiding when a late target cannot be observed", async () => {
    const disconnect = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class LateFailureIntersectionObserver {
        observe(element: Element) {
          if (element.classList.contains("play-entry")) {
            throw new Error("late observation failed");
          }
        }
        unobserve = vi.fn();
        disconnect = disconnect;
      },
    );

    const { container } = render(<ScrollRevealFallback />);
    expect(document.documentElement).toHaveAttribute(
      "data-reveal-ready",
      "true",
    );

    const lateTarget = document.createElement("div");
    lateTarget.className = "play-entry";
    container.append(lateTarget);

    await vi.waitFor(() => {
      expect(document.documentElement).not.toHaveAttribute(
        "data-reveal-ready",
      );
    });
    expect(disconnect).toHaveBeenCalled();

    lateTarget.remove();
  });

  it("does not globally hide targets without mutation discovery", () => {
    const observe = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class MockIntersectionObserver {
        observe = observe;
        unobserve = vi.fn();
        disconnect = vi.fn();
      },
    );
    vi.stubGlobal("MutationObserver", undefined);

    render(
      <>
        <div className="play-entry">Visible without mutation discovery</div>
        <ScrollRevealFallback />
      </>,
    );

    expect(document.documentElement).not.toHaveAttribute("data-reveal-ready");
    expect(observe).not.toHaveBeenCalled();
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
