import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function routeSource(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("case-study lead-media geometry", () => {
  it("uses verified Fresh Greens dimensions and presentation", () => {
    const source = routeSource("src/app/work/fresh-greens/page.tsx");

    expect(source).toMatch(
      /<LeadMedia[\s\S]*?cover="\/projects\/fresh-greens\/cover\.png"[\s\S]*?width=\{2560\}[\s\S]*?height=\{1862\}[\s\S]*?presentation="fresh-greens"[\s\S]*?\/>/,
    );
    expect(source).toMatch(
      /<LeadVideo[\s\S]*?clip="\/projects\/fresh-greens\/process\/active-nav-flat-route\.mp4"[\s\S]*?width=\{1290\}[\s\S]*?height=\{2796\}[\s\S]*?\/>/,
    );

    const original = resolve(
      process.cwd(),
      "public/projects/fresh-greens/v2/en-route.png",
    );
    const poster = resolve(
      process.cwd(),
      "public/projects/fresh-greens/v2/en-route.webp",
    );
    expect(existsSync(poster)).toBe(true);
    expect(statSync(poster).size).toBeLessThan(statSync(original).size);
  });

  it("uses verified Navi dimensions", () => {
    expect(routeSource("src/app/work/navi/page.tsx")).toMatch(
      /<LeadMedia[\s\S]*?cover="\/projects\/navi\/cover\.png"[\s\S]*?width=\{2048\}[\s\S]*?height=\{1365\}[\s\S]*?\/>/,
    );
  });

  it("uses verified Understanding FAFSA dimensions", () => {
    expect(routeSource("src/app/work/understandingfafsa/page.tsx")).toMatch(
      /<LeadMedia[\s\S]*?cover="\/projects\/understandingfafsa\/cover\.png"[\s\S]*?width=\{4000\}[\s\S]*?height=\{3000\}[\s\S]*?\/>/,
    );
  });
});
