import { describe, expect, it } from "vitest";
import { getPublishedProjects } from "@/lib/content";

describe("outcome frontmatter fields", () => {
  it("parses outcomeLead / outcomeRest as strings when present", async () => {
    const projects = await getPublishedProjects();
    const fafsa = projects.find((p) => p.slug === "understandingfafsa");
    expect(fafsa).toBeDefined();
    expect(fafsa!.outcomeLead).toBe("75% lift");
    expect(typeof fafsa!.outcomeRest).toBe("string");
    expect(fafsa!.outcomeRest!.length).toBeGreaterThan(0);
  });

  it("leaves a field undefined when its key is absent", async () => {
    const projects = await getPublishedProjects();
    // Navi seeds only outcomeRest; the lead falls back at render time.
    const navi = projects.find((p) => p.slug === "navi");
    expect(navi!.outcomeLead).toBeUndefined();
    expect(typeof navi!.outcomeRest).toBe("string");
  });
});
