import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// next/font/google is a build-time loader Next injects via SWC; it isn't a real
// callable function at vitest runtime. Stub the font factories the minisite uses
// so any module that instantiates a font at import time (src/lib/navi/fonts.ts,
// pulled in transitively by the overlay token scope) loads without throwing.
vi.mock("next/font/google", () => ({
  Geist_Mono: () => ({ variable: "--font-geist-mono", className: "geist-mono" }),
  Instrument_Sans: () => ({
    variable: "--font-family-sans",
    className: "instrument-sans",
  }),
  Instrument_Serif: () => ({
    variable: "--font-quote",
    className: "instrument-serif",
  }),
  Jost: () => ({ variable: "--nv-font-display", className: "navi-display" }),
  Lato: () => ({ variable: "--nv-font-body", className: "navi-body" }),
}));

// jsdom does not implement matchMedia. Several components query
// prefers-reduced-motion (and similar) in effects; stub a default
// "no match" implementation so mounting them doesn't throw.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// jsdom does not implement HTMLMediaElement playback. Components that call
// video.play()/.pause() in effects (e.g. autoplaying lead media) would
// otherwise throw "not implemented" when mounted in tests.
if (typeof window !== "undefined") {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
}

afterEach(() => {
  cleanup();
});
