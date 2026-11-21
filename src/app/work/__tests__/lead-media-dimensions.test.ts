import { existsSync, readFileSync } from "node:fs";
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

  it("serves the simulator recording and a poster at the declared phone dimensions", async () => {
    const media = routeSource("src/app/work/fresh-greens/page.tsx").match(/<LeadVideo[\s\S]*?\/>/)![0];
    const clip = media.match(/clip="([^"]+)"/)![1];
    const poster = media.match(/poster="([^"]+)"/)![1];
    const { default: sharp } = await import("sharp");
    const info = await sharp(resolve(process.cwd(), "public" + poster)).metadata();
    expect(existsSync(resolve(process.cwd(), "public" + clip))).toBe(true);
    expect(media).toContain(`width={${info.width}}`);
    expect(media).toContain(`height={${info.height}}`);
  });

});
