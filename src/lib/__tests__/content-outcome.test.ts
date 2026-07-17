import { describe, expect, it } from "vitest";
import { getPublishedProjects } from "@/lib/content";

describe("outcome frontmatter fields", () => {
  it("parses outcomeLead / outcomeRest as strings when present", async () => {
    const projects = await getPublishedProjects();
    const fafsa = projects.find((p) => p.slug === "understandingfafsa");
    expect(fafsa).toBeDefined();
    expect(fafsa!.summary).toBe(
      "Built a modular newsletter system for a site rebrand. The first redesigned send had an observed ~52.6% open rate with Mailchimp Privacy Protection excluded.",
    );
    expect(fafsa!.outcomeMetricLabel).toBe(
      "observed open rate on the first redesigned send, with Mailchimp Privacy Protection excluded",
    );
    expect(fafsa!.outcomeLead).toBe("~52.6%");
    expect(fafsa!.outcomeRest).toBe(
      "observed open rate on the first redesigned send, with Mailchimp Privacy Protection excluded.",
    );
  });

  it("leaves a field undefined when its key is absent", async () => {
    const projects = await getPublishedProjects();
    // Navi seeds only outcomeRest; the lead falls back at render time.
    const navi = projects.find((p) => p.slug === "navi");
    expect(navi!.outcomeLead).toBeUndefined();
    expect(typeof navi!.outcomeRest).toBe("string");
  });
});
