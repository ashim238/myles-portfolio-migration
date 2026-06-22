import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// next/font/google is a build-time loader Next injects via SWC; it isn't a real
// callable function at vitest runtime. Stub the font factories the minisite uses
// so any module that instantiates a font at import time (src/lib/navi/fonts.ts,
// pulled in transitively by the overlay token scope) loads without throwing.
vi.mock("next/font/google", () => ({
  Jost: () => ({ variable: "--nv-font-display", className: "navi-display" }),
  Lato: () => ({ variable: "--nv-font-body", className: "navi-body" }),
}));

afterEach(() => {
  cleanup();
});
