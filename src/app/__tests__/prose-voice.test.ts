import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function read(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("portfolio prose voice", () => {
  it("keeps the About project summary concrete and compact", () => {
    const source = read("src/app/about/page.tsx").replace(/\s+/g, " ");

    expect(source).toContain(
      "My thesis became Fresh Greens, a React Native wayfinding prototype for Black drivers.",
    );
    expect(source).toContain(
      "Light Academia entered the launch library, and I later learned through Global Creative Lab that American Eagle selected it.",
    );
    expect(source).not.toContain("the one template");
    expect(source).not.toContain("My thesis was a solo-built React Native wayfinding app");
  });

  it("removes known user-facing em dashes from the audited copy", () => {
    const palette = read("src/lib/fresh-greens/palette.ts");
    const content = read("src/lib/content.ts");

    expect(palette).not.toContain("—");
    expect(content).not.toContain("Sukuna's Finger —");
  });

  it("turns the Navi system fragments into natural instructions", () => {
    const source = read("src/app/work/navi/(minisite)/system/page.tsx");

    expect(source).toContain("Try a variant and watch the component update.");
    expect(source).toContain('intro="Tokens, type, and spacing."');
    expect(source).not.toContain("Pick a variant. Watch it update.");
    expect(source).not.toContain("The canvas. Tokens, type, and spacing.");
  });
});
