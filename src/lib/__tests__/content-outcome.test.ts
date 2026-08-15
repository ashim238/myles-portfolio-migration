import { describe, expect, it } from "vitest";
import { getPublishedProjects } from "@/lib/content";

describe("outcome frontmatter fields", () => {
  it("parses outcomeLead / outcomeRest as strings when present", async () => {
    const projects = await getPublishedProjects();
    const fafsa = projects.find((p) => p.slug === "understandingfafsa");
    expect(fafsa).toBeDefined();
    expect(fafsa!.summary).toBe(
      "The founder needed a newsletter she could edit herself, one that matched the personality of the new website. I designed a three-theme Mailchimp kit that she has used for roughly 20 sends. The first redesigned send had an observed ~52.6% open rate with Mailchimp Privacy Protection excluded, but this wasn't a controlled attribution test.",
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
