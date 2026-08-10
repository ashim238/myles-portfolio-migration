import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DotCursor } from "@/components/dot-cursor";

const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);
const polishStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-98-polish.css"),
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

  it("keeps a dual-contrast mark visible across open backgrounds and interactive targets", () => {
    expect(baseStyles).toContain("--cursor-fill: #f4f4f4");
    expect(baseStyles).toContain("--cursor-outline: #050505");
    expect(baseStyles).toMatch(
      /:root\[data-theme="light"\]\s*\{[\s\S]*?--cursor-fill:\s*#111111;[\s\S]*?--cursor-outline:\s*#fafafa;/,
    );
    expect(declarationBlock(".dot-cursor")).toContain("pointer-events: none");
    expect(polishStyles).toMatch(
      /\.dot-cursor\s*\{[\s\S]*?width:\s*24px;[\s\S]*?height:\s*32px;/,
    );
    expect(polishStyles).toMatch(
      /\.myles98-cursor-outline\s*\{[\s\S]*?fill:\s*var\(--m97-ink\);/,
    );
    expect(polishStyles).toMatch(
      /\.myles98-cursor-fill\s*\{[\s\S]*?fill:\s*#fff;/,
    );
  });

  it("renders an authored pixel pointer with hover, pressed, and input states", () => {
    const { container } = render(<DotCursor />);

    expect(container.querySelector(".myles98-cursor-arrow")).toBeInTheDocument();
    expect(container.querySelector(".myles98-cursor-ibeam")).toBeInTheDocument();
    expect(container.querySelector(".myles98-cursor-outline")).toBeInTheDocument();
    expect(container.querySelector(".myles98-cursor-fill")).toBeInTheDocument();
    expect(polishStyles).toMatch(
      /\.dot-cursor--hover \.myles98-cursor-fill\s*\{[\s\S]*?fill:\s*var\(--m97-signal\);/,
    );
    expect(polishStyles).toMatch(
      /\.dot-cursor--pressed \.myles98-cursor-arrow\s*\{[\s\S]*?transform:\s*translate\(-1px, -1px\);/,
    );
    expect(polishStyles).toMatch(
      /\.dot-cursor--input \.myles98-cursor-ibeam\s*\{[\s\S]*?display:\s*block;/,
    );
  });
});
