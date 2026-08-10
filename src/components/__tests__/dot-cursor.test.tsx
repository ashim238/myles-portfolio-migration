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
      /\.dot-cursor\s*\{[\s\S]*?width:\s*32px;[\s\S]*?height:\s*32px;/,
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
      /\.dot-cursor--pressed \.myles98-cursor-arrow\s*\{[\s\S]*?transform:\s*translate\(1px, 1px\);/,
    );
    expect(polishStyles).toMatch(
      /\.dot-cursor--input \.myles98-cursor-ibeam\s*\{[\s\S]*?display:\s*block;/,
    );
  });

  it("locks the arrow to the public-domain Windows 95/98 32px pixel master", () => {
    const { container } = render(<DotCursor />);
    const arrow = container.querySelector(".myles98-cursor-arrow");

    expect(arrow).toHaveAttribute("viewBox", "0 0 32 32");
    expect(arrow).toHaveAttribute("data-m98-cursor-hotspot", "0 0");
    expect(arrow).toHaveAttribute("data-m98-pixel-bounds", "0 0 11 19");
    expect(arrow?.querySelector(".myles98-cursor-outline")).toHaveAttribute(
      "d",
      "M0 0h1v1H0ZM0 1h2v1H0ZM0 2h3v1H0ZM0 3h4v1H0ZM0 4h5v1H0ZM0 5h6v1H0ZM0 6h7v1H0ZM0 7h8v1H0ZM0 8h9v1H0ZM0 9h10v1H0ZM0 10h11v1H0ZM0 11h7v1H0ZM0 12h3v1H0ZM4 12h4v1H4ZM0 13h2v1H0ZM4 13h4v1H4ZM0 14h1v1H0ZM5 14h4v1H5ZM5 15h4v1H5ZM6 16h4v1H6ZM6 17h4v1H6ZM7 18h2v1H7Z",
    );
    expect(arrow?.querySelector(".myles98-cursor-fill")).toHaveAttribute(
      "d",
      "M1 2h1v1H1ZM1 3h2v1H1ZM1 4h3v1H1ZM1 5h4v1H1ZM1 6h5v1H1ZM1 7h6v1H1ZM1 8h7v1H1ZM1 9h8v1H1ZM1 10h5v1H1ZM1 11h2v1H1ZM4 11h2v1H4ZM1 12h1v1H1ZM5 12h2v1H5ZM5 13h2v1H5ZM6 14h2v1H6ZM6 15h2v1H6ZM7 16h2v1H7ZM7 17h2v1H7Z",
    );
    expect(arrow?.querySelector(".myles98-cursor-accent")).toBeNull();
  });

  it("aligns the matching I-beam through its declared center hotspot", () => {
    const { container } = render(<DotCursor />);
    const beam = container.querySelector(".myles98-cursor-ibeam");

    expect(beam).toHaveAttribute("viewBox", "0 0 32 32");
    expect(beam).toHaveAttribute("data-m98-cursor-hotspot", "10 10");
    expect(beam).toHaveAttribute("data-m98-pixel-bounds", "6 1 9 18");
    expect(beam?.querySelector(".myles98-cursor-outline")).toHaveAttribute(
      "d",
      "M6 1h9v3H6ZM9 4h3v12H9ZM6 16h9v3H6Z",
    );
    expect(beam?.querySelector(".myles98-cursor-fill")).toHaveAttribute(
      "d",
      "M7 2h3v1H7ZM11 2h3v1H11ZM10 3h1v14H10ZM7 17h3v1H7ZM11 17h3v1H11Z",
    );
    expect(polishStyles).toMatch(
      /\.myles98-cursor-ibeam\s*\{[\s\S]*?width:\s*32px;[\s\S]*?height:\s*32px;[\s\S]*?transform:\s*translate\(-10px, -10px\);/,
    );
  });
});
