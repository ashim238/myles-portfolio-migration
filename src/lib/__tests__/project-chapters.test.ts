import { describe, expect, it } from "vitest";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";

describe("case-study chapter maps", () => {
  it("uses the approved chapter counts", () => {
    expect(CASE_STUDY_CHAPTERS["fresh-greens"]).toHaveLength(6);
    expect(CASE_STUDY_CHAPTERS.navi).toHaveLength(5);
    expect(CASE_STUDY_CHAPTERS.tiktok).toHaveLength(5);
    expect(CASE_STUDY_CHAPTERS.understandingfafsa).toHaveLength(5);
  });

  it("never exceeds six chapters and keeps IDs unique within each story", () => {
    for (const chapters of Object.values(CASE_STUDY_CHAPTERS)) {
      expect(chapters.length).toBeLessThanOrEqual(6);
      expect(new Set(chapters.map((chapter) => chapter.id)).size).toBe(
        chapters.length,
      );
    }
  });

  it("uses the approved process language and order", () => {
    expect(CASE_STUDY_CHAPTERS).toEqual({
      "fresh-greens": [
        { id: "fg-problem", stage: "Frame", title: "Why time and distance were not enough" },
        { id: "fg-research", stage: "Research", title: "What interviews with Black drivers changed" },
        { id: "fg-design", stage: "Design", title: "Safer route decisions" },
        { id: "fg-refine", stage: "Refine", title: "The visual system after the routing pivot" },
        { id: "fg-trust", stage: "Trust", title: "Moderating community reports" },
        { id: "fg-scope", stage: "Validate", title: "What I built and what still needs proof" },
      ],
      navi: [
        { id: "nv-intro", stage: "Frame", title: "Concentrated tourism as a routing problem" },
        { id: "nv-insights", stage: "Research", title: "The resident survey redirected the concept" },
        { id: "nv-framework", stage: "Define", title: "Research shaped exploration and booking" },
        { id: "nv-build", stage: "Build", title: "From prototype to booking flow" },
        { id: "nv-outcome", stage: "Validate", title: "What I would test next" },
      ],
      tiktok: [
        { id: "tt-research", stage: "Research", title: "Fashion subcultures on TikTok" },
        { id: "tt-system", stage: "Define", title: "The fixed catalog structure" },
        { id: "tt-modular", stage: "Explore", title: "Templates as modular parts" },
        { id: "tt-templates", stage: "Build", title: "From sketches to layered files" },
        { id: "tt-outcome", stage: "Deliver", title: "What shipped from the launch batch" },
      ],
      understandingfafsa: [
        { id: "uf-context", stage: "Frame", title: "A rebrand and a weekly workflow" },
        { id: "uf-audit", stage: "Research", title: "What 120 newsletters revealed" },
        { id: "uf-locked", stage: "Define", title: "Rules for fixed and swappable parts" },
        { id: "uf-figma", stage: "Build", title: "Rebuilding the system in Mailchimp" },
        { id: "uf-results", stage: "Measure", title: "The first redesigned send" },
      ],
    });
  });

  it("keeps chapter language free of banned punctuation", () => {
    for (const chapters of Object.values(CASE_STUDY_CHAPTERS)) {
      for (const chapter of chapters) {
        expect(`${chapter.stage} ${chapter.title}`).not.toMatch(/[—;…]/);
      }
    }
  });
});
