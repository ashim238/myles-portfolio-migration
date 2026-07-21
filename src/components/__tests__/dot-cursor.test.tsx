import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DotCursor } from "@/components/dot-cursor";

const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);

function declarationBlock(selector: string): string {
  const start = baseStyles.indexOf(`${selector} {`);
  if (start < 0) return "";
  const open = baseStyles.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < baseStyles.length; index += 1) {
    if (baseStyles[index] === "{") depth += 1;
    if (baseStyles[index] === "}") depth -= 1;
    if (depth === 0) return baseStyles.slice(start, index + 1);
  }
  return "";
}

describe("DotCursor", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dot-cursor-ready");
  });

  it("hides the native cursor only after the custom cursor is ready", () => {
    const { unmount } = render(<DotCursor />);

    expect(document.documentElement).toHaveClass("dot-cursor-ready");

    unmount();
    expect(document.documentElement).not.toHaveClass("dot-cursor-ready");
  });

  it("keeps the native cursor when reduced motion is requested", () => {
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

    render(<DotCursor />);

    expect(document.documentElement).not.toHaveClass("dot-cursor-ready");
  });

  it("uses a compact hollow ring over interactive targets", () => {
    const cursorStyles = declarationBlock(".dot-cursor::before");
    const hoverStyles = declarationBlock(".dot-cursor--hover::before");

    expect(baseStyles).toContain("--cursor-contrast-source: #f4f4f4");
    expect(cursorStyles).toContain("background: var(--cursor-contrast-source)");
    expect(cursorStyles).toContain("mix-blend-mode: difference");
    expect(hoverStyles).toContain("background: transparent");
    expect(hoverStyles).toContain(
      "border: 1px solid var(--cursor-contrast-source)",
    );
    expect(hoverStyles).toContain("scale(2)");
    expect(hoverStyles).not.toContain("scale(2.6)");
    expect(hoverStyles).not.toContain("var(--foreground)");
  });
});
