import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeadVideo } from "@/components/lead-video";

let intersectionCallback: IntersectionObserverCallback;

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = "320px";
  thresholds = [0];
}

describe("LeadVideo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("loads near the viewport, plays while visible, and pauses after leaving", () => {
    const { container } = render(
      <LeadVideo
        clip="/projects/fresh-greens/process/active-nav.mp4"
        poster="/projects/fresh-greens/v2/en-route.png"
        alt="Navigation in motion"
      />,
    );
    const video = container.querySelector("video")!;

    expect(container.querySelector("source")).toBeNull();
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("controls");

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(container.querySelector("source")).toHaveAttribute(
      "src",
      "/projects/fresh-greens/process/active-nav.mp4",
    );
    expect(video.play).toHaveBeenCalled();

    act(() => {
      intersectionCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(video.pause).toHaveBeenCalled();
  });

  it("loads for opt-in playback but does not autoplay with reduced motion", () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <LeadVideo clip="/motion.mov" poster="/poster.png" alt="Motion demo" />,
    );
    const video = container.querySelector("video")!;

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(container.querySelector("source")).toHaveAttribute("src", "/motion.mov");
    expect(video.play).not.toHaveBeenCalled();
    expect(video.pause).toHaveBeenCalled();
  });
});
