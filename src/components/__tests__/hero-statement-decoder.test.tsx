import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroStatementDecoder } from "@/components/hero-statement-decoder";

const PROFESSIONAL =
  "I design digital products and stay close through the build.";
const FINAL = "I count down to each Absolute Batman drop.";
const STATEMENTS = [
  PROFESSIONAL,
  "I sweat the empty states and the error copy.",
  "I make my own roti from scratch.",
  FINAL,
] as const;

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

describe("HeroStatementDecoder", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders the professional statement before the timer advances", () => {
    stubReducedMotion(false);
    const { container } = render(<HeroStatementDecoder />);

    expect(
      container.querySelector(".hero-statement-decoder-visible"),
    ).toHaveTextContent(PROFESSIONAL);
    expect(
      container.querySelector(".hero-statement-decoder-sizer"),
    ).toHaveTextContent(PROFESSIONAL);
  });

  it("reserves wrapped geometry for every statement", () => {
    stubReducedMotion(false);
    const { container } = render(<HeroStatementDecoder />);
    const sizers = Array.from(
      container.querySelectorAll(".hero-statement-decoder-sizer"),
    );

    expect(sizers).toHaveLength(STATEMENTS.length);
    expect(sizers.map((sizer) => sizer.textContent)).toEqual(STATEMENTS);
    sizers.forEach((sizer) => {
      expect(sizer).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("holds the professional statement before decoding", () => {
    stubReducedMotion(false);
    const { container } = render(<HeroStatementDecoder />);
    const visible = container.querySelector(
      ".hero-statement-decoder-visible",
    );

    act(() => vi.advanceTimersByTime(1000));

    expect(visible).toHaveTextContent(PROFESSIONAL);
  });

  it("completes every scramble and decode transition in 500 to 700ms", () => {
    stubReducedMotion(false);
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { container } = render(<HeroStatementDecoder />);
    const visible = container.querySelector(
      ".hero-statement-decoder-visible",
    );
    const visibleText = () => visible?.textContent?.replace("|", "") ?? "";

    for (let index = 1; index < STATEMENTS.length; index += 1) {
      const previous = STATEMENTS[index - 1];
      let ticks = 0;
      while (visibleText() === previous && ticks < 100) {
        act(() => vi.advanceTimersByTime(38));
        ticks += 1;
      }

      expect(visibleText()).not.toBe(previous);
      act(() => vi.advanceTimersByTime(494));
      expect(visibleText()).not.toBe(STATEMENTS[index]);
      act(() => vi.advanceTimersByTime(190));
      expect(visibleText()).toBe(STATEMENTS[index]);
    }
  });

  it("never blanks the line and stops on the Absolute Batman statement", () => {
    stubReducedMotion(false);
    const { container } = render(<HeroStatementDecoder />);
    const visible = container.querySelector(
      ".hero-statement-decoder-visible",
    );

    for (let tick = 0; tick < 600; tick += 1) {
      act(() => vi.advanceTimersByTime(38));
      expect(visible?.textContent?.replace("|", "").length).toBeGreaterThan(0);
      if (visible?.textContent?.includes(FINAL)) break;
    }

    act(() => vi.advanceTimersByTime(2000));
    expect(visible).toHaveTextContent(FINAL);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("keeps animated frames out of the accessibility tree", () => {
    stubReducedMotion(false);
    const { container } = render(<HeroStatementDecoder />);

    expect(
      container.querySelector(".hero-statement-decoder-visible"),
    ).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".sr-only")).toHaveTextContent(
      `${PROFESSIONAL} I sweat the empty states and the error copy. ` +
        "I make my own roti from scratch. " +
        FINAL,
    );
    expect(container.querySelector(".sr-only")?.textContent).not.toMatch(
      /[—;…]/,
    );
    expect(
      container.querySelector('[aria-live]:not([aria-live="off"])'),
    ).toBeNull();
  });

  it("keeps the professional statement static for reduced motion", () => {
    stubReducedMotion(true);
    const { container } = render(<HeroStatementDecoder />);

    act(() => vi.advanceTimersByTime(30000));

    expect(
      container.querySelector(".hero-statement-decoder-visible"),
    ).toHaveTextContent(PROFESSIONAL);
    expect(
      container.querySelector(".hero-statement-decoder-cursor"),
    ).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });
});
