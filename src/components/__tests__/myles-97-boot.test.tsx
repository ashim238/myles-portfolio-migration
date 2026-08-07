import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BootSequence,
  MYLES97_BOOT_MAX_MS,
} from "@/components/myles-97/boot-sequence";

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    void priority;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt} />;
  },
}));

describe("BootSequence", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("skips on the first key or pointer action and completes only once", () => {
    const onComplete = vi.fn();
    render(<BootSequence eligible onComplete={onComplete} />);

    expect(screen.getByText("Loading selected work...")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Enter" });

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Loading selected work...")).toBeNull();

    fireEvent.pointerDown(window);
    act(() => vi.advanceTimersByTime(MYLES97_BOOT_MAX_MS + 100));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("finishes at or before the 1.5 second ceiling", () => {
    const onComplete = vi.fn();
    render(<BootSequence eligible onComplete={onComplete} />);

    act(() => vi.advanceTimersByTime(MYLES97_BOOT_MAX_MS));
    expect(MYLES97_BOOT_MAX_MS).toBeLessThanOrEqual(1500);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("bypasses the presentation for reduced motion", () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
    } as MediaQueryList);
    const onComplete = vi.fn();

    render(<BootSequence eligible onComplete={onComplete} />);

    expect(screen.queryByText("Loading selected work...")).toBeNull();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("also respects the saved Myles 97 reduced-motion preference", () => {
    const onComplete = vi.fn();
    render(
      <BootSequence eligible reduceMotion onComplete={onComplete} />,
    );

    expect(screen.queryByText("Loading selected work...")).toBeNull();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
