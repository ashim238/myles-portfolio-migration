import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const page = readFileSync(resolve(process.cwd(), "src/app/work/navi/page.tsx"), "utf8");
const prose = page.replace(/\s+/g, " ");

describe("Navi case-study structure", () => {
  it("names every process stage in chronological order", () => {
    const headings = Array.from(
      page.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g),
      ([, id, title]) => ({ id, title: title.trim() }),
    );

    expect(headings).toEqual([
      { id: "nv-intro", title: "Concentrated tourism as a routing problem" },
      { id: "nv-heatmap", title: "The first prototype: a Manhattan heatmap" },
      {
        id: "nv-research",
        title: "Platform audits and resident research",
      },
      { id: "nv-insights", title: "The resident survey redirected the concept" },
      { id: "nv-framework", title: "Mapping the experience before the build" },
      { id: "nv-system", title: "Rebuilding Navi as a working system" },
      { id: "nv-screens", title: "A working booking flow" },
      { id: "nv-outcome", title: "What I would validate next" },
    ]);
  });

  it("keeps future validation framed as planned work", () => {
    expect(prose).toContain("Deeper neighborhood pages in Learn");
    expect(prose).toContain("onboarding for local hosts and businesses");
    expect(prose).toMatch(/Group booking.{0,100}future opportunity/);
    expect(prose).toContain("not wired into the current rebuild");
  });
});
