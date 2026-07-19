import { render } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DrawOnView } from "@/components/draw-on-view";

function Drawing() {
  return (
    <DrawOnView>
      <svg aria-label="Route drawing">
        <g data-draw>
          <path d="M0 0 L10 10" />
        </g>
      </svg>
    </DrawOnView>
  );
}

describe("DrawOnView", () => {
  beforeEach(() => {
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
    Object.defineProperty(SVGElement.prototype, "getTotalLength", {
      configurable: true,
      value: vi.fn(() => 100),
    });
    Reflect.deleteProperty(window, "IntersectionObserver");
  });

  afterEach(() => {
    Reflect.deleteProperty(SVGElement.prototype, "getTotalLength");
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("leaves strokes fully drawn when IntersectionObserver is unavailable", () => {
    let result: RenderResult | undefined;

    expect(() => {
      result = render(<Drawing />);
    }).not.toThrow();

    const path = result!.container.querySelector("path");
    expect(path?.style.strokeDasharray).toBe("");
    expect(path?.style.strokeDashoffset).toBe("");
    expect(path?.style.transition).toBe("");
  });

  it("does not park strokes when the observer cannot be constructed", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class ThrowingIntersectionObserver {
        constructor() {
          throw new Error("observer construction failed");
        }
      },
    );
    let result: RenderResult | undefined;

    expect(() => {
      result = render(<Drawing />);
    }).not.toThrow();

    const path = result!.container.querySelector("path");
    expect(path?.style.strokeDasharray).toBe("");
    expect(path?.style.strokeDashoffset).toBe("");
    expect(path?.style.transition).toBe("");
  });

  it("restores strokes when observer attachment fails", () => {
    const disconnect = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class ThrowingObserveIntersectionObserver {
        observe() {
          throw new Error("observe failed");
        }
        disconnect = disconnect;
      },
    );
    let result: RenderResult | undefined;

    expect(() => {
      result = render(<Drawing />);
    }).not.toThrow();

    const path = result!.container.querySelector("path");
    expect(path?.style.strokeDasharray).toBe("");
    expect(path?.style.strokeDashoffset).toBe("");
    expect(path?.style.transition).toBe("");
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("does not park strokes until observer attachment succeeds", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class InspectingIntersectionObserver {
        observe(element: Element) {
          const path = element.querySelector("path");
          expect(path?.style.strokeDasharray).toBe("");
          expect(path?.style.strokeDashoffset).toBe("");
          expect(path?.style.transition).toBe("");
        }
        disconnect = vi.fn();
      },
    );

    const { container } = render(<Drawing />);
    const path = container.querySelector("path");

    expect(path?.style.strokeDasharray).toBe("100");
    expect(path?.style.strokeDashoffset).toBe("100");
    expect(path?.style.transition).toBe("none");
  });

  it("leaves strokes fully drawn for reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<Drawing />);

    const path = container.querySelector("path");
    expect(path?.style.strokeDasharray).toBe("");
    expect(path?.style.strokeDashoffset).toBe("");
    expect(path?.style.transition).toBe("");
  });
});
