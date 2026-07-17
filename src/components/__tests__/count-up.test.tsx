import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CountUp } from "@/components/count-up";

let intersectionCallback: IntersectionObserverCallback;
const observerConstructed = vi.fn();
const disconnect = vi.fn();

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    observerConstructed();
    intersectionCallback = callback;
  }

  observe = vi.fn();
  disconnect = disconnect;
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = "0px";
  thresholds = [0.6];
}

function stubReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" && matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("CountUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("keeps the factual value visible while emphasizing it once in view", () => {
    stubReducedMotion(false);
    render(<CountUp value="~30% → ~52.6%" />);

    const fact = screen.getByText("~30% → ~52.6%");
    expect(fact).not.toHaveAttribute("data-count-up-emphasized");

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(fact).toHaveTextContent("~30% → ~52.6%");
    expect(fact).toHaveAttribute("data-count-up-emphasized", "true");
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("shows the factual value without constructing an observer for reduced motion", () => {
    stubReducedMotion(true);
    render(<CountUp value="1" />);

    expect(screen.getByText("1")).toBeVisible();
    expect(observerConstructed).not.toHaveBeenCalled();
  });
});
