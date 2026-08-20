import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BootSequence,
  MYLES97_BOOT_MAX_MS,
} from "@/components/myles-97/boot-sequence";

const myles97Css = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-97.css"),
  "utf8",
);

describe("Myles 98 BootSequence", () => {
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

  it("provides an explicit skip action and completes only once", () => {
    const onComplete = vi.fn();
    render(<BootSequence eligible onComplete={onComplete} />);

    expect(screen.getByText("MDT BIOS v0.98")).toBeInTheDocument();
    expect(screen.getByText("Loading selected work...")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Skip boot/ }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Loading selected work...")).toBeNull();

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

  it("uses the MDT mark as the boot identity", () => {
    const { container } = render(
      <BootSequence eligible onComplete={vi.fn()} />,
    );

    expect(container.querySelector(".myles97-boot-mark")).toHaveTextContent("MDT");
    expect(screen.getByText("Myles Designs Things")).toBeInTheDocument();
  });

  it("keeps Tab predictable and exposes Escape as the keyboard exit", () => {
    const onComplete = vi.fn();
    render(<BootSequence eligible onComplete={onComplete} />);

    expect(screen.getByRole("button", { name: /Skip boot/ })).toHaveFocus();
    fireEvent.keyDown(window, { key: "Tab" });
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("renders a decorative sixteen-segment classic progress bar", () => {
    const { container } = render(
      <BootSequence eligible onComplete={vi.fn()} />,
    );

    const progress = container.querySelector(".myles97-boot-progress");
    expect(progress).toHaveAttribute("aria-hidden", "true");
    expect(
      progress?.querySelectorAll(".myles97-boot-progress-segment"),
    ).toHaveLength(16);
  });

  it("leaves every segment visible when motion is reduced", () => {
    const systemReducedStart = myles97Css.indexOf(
      "@media (prefers-reduced-motion: reduce)",
    );
    const savedReducedStart = myles97Css.indexOf(
      '[data-m97-motion="reduce"]',
      systemReducedStart,
    );
    const systemReducedRules = myles97Css.slice(
      systemReducedStart,
      savedReducedStart,
    );
    const savedReducedRules = myles97Css.slice(savedReducedStart);
    const segmentRule = myles97Css.match(
      /\.myles97-boot-progress-segment\s*\{([\s\S]*?)\n\}/,
    )?.[1];

    expect(segmentRule).toContain("animation:");
    expect(segmentRule).not.toContain("infinite");
    for (const reducedRules of [systemReducedRules, savedReducedRules]) {
      expect(reducedRules).toContain(".myles97-boot-progress-segment");
      expect(reducedRules).toMatch(/animation:\s*none\s*!important/);
      expect(reducedRules).toMatch(/opacity:\s*1/);
    }
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

  it("also respects the saved Myles 98 reduced-motion preference", () => {
    const onComplete = vi.fn();
    render(
      <BootSequence eligible reduceMotion onComplete={onComplete} />,
    );

    expect(screen.queryByText("Loading selected work...")).toBeNull();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
