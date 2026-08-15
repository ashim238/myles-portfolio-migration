import { describe, expect, it } from "vitest";
import {
  CASE_STUDY_CHAPTERS,
  type ProjectChapterVariant,
} from "@/lib/project-chapters";
import {
  CLAIM_CLASSES,
  EVIDENCE_ARTIFACT_KINDS,
  EVIDENCE_STATES,
  READER_EVIDENCE_MAPS,
  getChapterEvidence,
  getEvidenceStateLabel,
  type ChapterEvidenceMap,
} from "@/lib/reader-evidence";

const projects = Object.keys(
  CASE_STUDY_CHAPTERS,
) as ProjectChapterVariant[];

function allChapters(): ChapterEvidenceMap[] {
  return projects.flatMap(
    (project) =>
      READER_EVIDENCE_MAPS[project]
        .chapters as readonly ChapterEvidenceMap[],
  );
}

describe("Reader evidence maps", () => {
  it("maps every case-study chapter exactly once and in reading order", () => {
    for (const project of projects) {
      const expectedIds = CASE_STUDY_CHAPTERS[project].map(({ id }) => id);
      const mappedIds = (
        READER_EVIDENCE_MAPS[project]
          .chapters as readonly ChapterEvidenceMap[]
      ).map(({ chapterId }) => chapterId);

      expect(mappedIds).toEqual(expectedIds);
      expect(new Set(mappedIds).size).toBe(mappedIds.length);
      expect(READER_EVIDENCE_MAPS[project].project).toBe(project);
      expect(READER_EVIDENCE_MAPS[project].portfolioSignal.trim()).not.toBe("");
    }

    expect(allChapters()).toHaveLength(20);
  });

  it("keeps every dominant claim, proof, and interpretation inspectable", () => {
    for (const chapter of allChapters()) {
      expect(chapter.dominantClaim.trim()).not.toBe("");
      expect(chapter.interpretation.trim()).not.toBe("");
      expect(CLAIM_CLASSES).toContain(chapter.claimClass);
      expect(EVIDENCE_STATES).toContain(chapter.evidenceState);
      expect(EVIDENCE_ARTIFACT_KINDS).toContain(chapter.dominantProof.kind);
      expect(chapter.dominantProof.id.trim()).not.toBe("");
      expect(chapter.dominantProof.label.trim()).not.toBe("");

      const proofs = [
        chapter.dominantProof,
        ...(chapter.supportingProofs ?? []),
      ];
      expect(new Set(proofs.map(({ id }) => id)).size).toBe(proofs.length);

      for (const proof of proofs) {
        expect(EVIDENCE_ARTIFACT_KINDS).toContain(proof.kind);
        expect(proof.id.trim()).not.toBe("");
        expect(proof.label.trim()).not.toBe("");
      }
    }
  });

  it("requires an explicit limitation for needs-proof and causal claims", () => {
    for (const chapter of allChapters()) {
      if (
        chapter.evidenceState === "needs-proof" ||
        chapter.claimClass === "causal"
      ) {
        expect(chapter.caveat?.trim().length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it("does not currently overstate any portfolio claim as causal", () => {
    expect(
      allChapters().filter(({ claimClass }) => claimClass === "causal"),
    ).toEqual([]);
  });

  it("retrieves canonical chapters and rejects project/chapter mismatches", () => {
    expect(getChapterEvidence("navi", "nv-build")).toMatchObject({
      evidenceState: "built",
      claimClass: "behavioral",
      dominantProof: { id: "navi-booking-demo", kind: "interaction" },
    });

    expect(() => getChapterEvidence("navi", "fg-design")).toThrow(
      "Missing Reader evidence map for navi:fg-design",
    );
  });

  it("registers the Fresh Greens recording as supporting built-product proof", () => {
    expect(getChapterEvidence("fresh-greens", "fg-scope")).toMatchObject({
      supportingProofs: [
        {
          id: "fresh-greens-architecture",
          label: "Public and community data architecture",
          kind: "diagram",
        },
        {
          id: "fresh-greens-en-route-video",
          label: "Working en-route prototype recording",
          kind: "interaction",
        },
      ],
    });
  });

  it("keeps Fresh Greens report attribution scoped to non-anonymous reports", () => {
    const trust = getChapterEvidence("fresh-greens", "fg-trust");

    expect(trust.dominantClaim).toContain(
      "other reports retain only current-account ownership",
    );
    expect(trust.dominantClaim).toContain(
      "Sensitive reports omit attribution",
    );
    expect(trust.dominantClaim).not.toContain(
      "Each report stays tied to a place, category, and contributor's account",
    );
  });

  it("keeps FAFSA middle-module order swappable while the frame stays locked", () => {
    const locked = getChapterEvidence("understandingfafsa", "uf-locked");

    expect(locked.interpretation).toContain("middle-module order can change");
    expect(locked.interpretation).toContain("Header and footer placement");
    expect(locked.interpretation).not.toContain("Section order");
    expect(locked.caveat).toBe(
      "The interactive switcher shows the weekly and event templates, not the welcome email.",
    );

    const implementation = getChapterEvidence(
      "understandingfafsa",
      "uf-figma",
    );
    expect(implementation.dominantClaim).toBe(
      "Practice sends exposed Gmail's 102 KB clipping threshold and dark-mode inversion before launch.",
    );
    expect(implementation.dominantClaim).not.toContain("stays editable");
  });

  it("labels the TikTok outcome as a confirmed launch-library result", () => {
    const outcome = getChapterEvidence("tiktok", "tt-outcome");

    expect(outcome).toMatchObject({
      evidenceState: "confirmed",
      dominantProof: {
        label: "Critique, response, and launch-library sequence",
      },
      interpretation:
        "The final direction records what changed during internal review. It does not show audience response.",
    });
    expect(getEvidenceStateLabel(outcome.evidenceState)).toBe("Confirmed");
    expect(READER_EVIDENCE_MAPS.tiktok.portfolioSignal).toContain(
      "confirmed launch-library artifact",
    );
    expect(outcome.dominantClaim).toBe(
      "Light Academia was refined through internal critique and entered the launch library.",
    );
    expect(outcome.dominantClaim).not.toContain("the one template");
  });

  it("keeps Navi evidence summaries in Myles's first-person voice", () => {
    const insights = getChapterEvidence("navi", "nv-insights");
    const framework = getChapterEvidence("navi", "nv-framework");
    const build = getChapterEvidence("navi", "nv-build");

    expect(READER_EVIDENCE_MAPS.navi.portfolioSignal).toBe(
      "I worked from 14 responses and built the Figma design system. I later rebuilt the booking flow in React.",
    );
    expect(insights.dominantClaim).toBe(
      "From what I remember, people wanted a deeper level of engagement with a neighborhood and its offerings.",
    );
    expect(insights.interpretation).toBe(
      "The heatmap was super surface-level. Learn, Plan, Go was our attempt to remove some of the barriers to branching out and exploring the city.",
    );
    expect(framework.interpretation).toBe(
      "My teammate proposed the original information architecture. I tweaked it to align with the personas and journey maps, then created the design system from head to toe.",
    );
    expect(framework.interpretation).not.toMatch(/^Myles\b/);
    expect(build.interpretation).toBe(
      "The design students focused on the layout. We made the cards the same height and cut down the copy and tags. The React demo now supports browsing, search, host detail, and a sample reservation.",
    );
  });

  it("keeps UnderstandingFAFSA evidence summaries founder-first and direct", () => {
    const context = getChapterEvidence("understandingfafsa", "uf-context");
    const audit = getChapterEvidence("understandingfafsa", "uf-audit");
    const locked = getChapterEvidence("understandingfafsa", "uf-locked");
    const results = getChapterEvidence("understandingfafsa", "uf-results");

    expect(READER_EVIDENCE_MAPS.understandingfafsa.portfolioSignal).toBe(
      "A Mailchimp system the founder can edit herself, shaped by what broke in practice sends.",
    );
    expect(context.dominantClaim).toBe(
      "The founder had a short turnaround each week, and the newsletter no longer matched the personality of the redesigned website.",
    );
    expect(context.interpretation).toBe(
      "I made the newsletter easier to scan and built the kit in Mailchimp so the founder could run it herself.",
    );
    expect(audit.dominantClaim).toBe(
      "Another designer and I reviewed more than 120 newsletters, then used what we found to decide what should stay fixed and what could change.",
    );
    expect(audit.interpretation).toBe(
      "Snacks influenced the copy and color treatment because it was easy to scan. HubSpot influenced the divider direction.",
    );
    expect(locked.dominantClaim).toBe(
      "The founder can change the content and module order without rebuilding the header, footer, spacing, type, or dividers.",
    );
    expect(results.dominantClaim).toBe(
      "The founder has used the kit for roughly 20 sends. The first redesigned send had a ~52.6% open rate with MPP excluded.",
    );
    expect(results.interpretation).toBe(
      "I include the open rate as context because it wasn't a controlled test. The founder still edits and sends the template herself each week.",
    );
  });

  it("keeps TikTok unknowns in Myles's first-person voice", () => {
    const system = getChapterEvidence("tiktok", "tt-system");
    const outcome = getChapterEvidence("tiktok", "tt-outcome");

    expect(system.caveat).toBe(
      "I proposed sharing a few parts between Light Academia and e-Boy/e-Girl. I don't have evidence that the team used them that way.",
    );
    expect(outcome.caveat).toBe(
      "I learned about the American Eagle selection later through Global Creative Lab. I didn't receive performance data.",
    );
  });
});
