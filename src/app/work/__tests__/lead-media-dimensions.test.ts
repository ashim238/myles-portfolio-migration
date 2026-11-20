import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function routeSource(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("case-study lead-media geometry", () => {
  it.each(["fresh-greens", "navi", "understandingfafsa"])("declares the actual opening dimensions and serves two source sizes for %s", async (slug) => {
    const source = routeSource(`src/app/work/${slug}/page.tsx`);
    const media = source.match(/<LeadMedia[\s\S]*?\/>/)?.[0] ?? "";
    const { default: sharp } = await import("sharp");
    for (const width of [640, 1280]) {
      const file = `/projects/${slug}/opening-${width}.webp`;
      const info = await sharp(resolve(process.cwd(), "public" + file)).metadata();
      expect(info.width).toBe(width);
      expect(media).toContain(file);
      if (width === 1280) {
        expect(media).toContain(`width={${width}}`);
        expect(media).toContain(`height={${info.height}}`);
      }
    }
  });

  it("preserves the optimized Fresh Greens route poster", () => {
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

});
