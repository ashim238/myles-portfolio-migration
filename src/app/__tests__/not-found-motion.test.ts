import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const secondaryStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-97-secondary.css"),
  "utf8",
);

describe("Myles 98 not-found treatment", () => {
  it("reuses the textured teal desktop and quiet system watermark", () => {
    expect(secondaryStyles).toMatch(
      /\.myles97-error-shell\s*\{[\s\S]*?radial-gradient\([\s\S]*?linear-gradient\([\s\S]*?var\(--m97-desktop\);/,
    );
    expect(secondaryStyles).toMatch(
      /\.myles97-error-shell::before\s*\{[\s\S]*?content:\s*"M98";[\s\S]*?pointer-events:\s*none;/,
    );
  });

  it("settles the already-visible dialog once in 250ms", () => {
    expect(secondaryStyles).toMatch(
      /@keyframes myles97-error-dialog-settle\s*\{[\s\S]*?(?:from|0%)\s*\{[\s\S]*?opacity:\s*1;[\s\S]*?transform:\s*translateY\(8px\) scale\(0\.98\);/,
    );
    expect(secondaryStyles).toMatch(
      /@media \(prefers-reduced-motion:\s*no-preference\)\s*\{[\s\S]*?\.myles97-system-dialog\s*\{[\s\S]*?animation:\s*myles97-error-dialog-settle 250ms cubic-bezier\(0\.23, 1, 0\.32, 1\)\s+both;/,
    );
    expect(secondaryStyles).not.toMatch(
      /myles97-error-dialog-settle[^;\n]*(?:infinite|iteration-count)/,
    );
  });

  it("uses a fully static dialog when reduced motion is requested", () => {
    expect(secondaryStyles).toMatch(
      /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.myles97-system-dialog\s*\{[\s\S]*?animation:\s*none;[\s\S]*?opacity:\s*1;[\s\S]*?transform:\s*none;/,
    );
  });
});
