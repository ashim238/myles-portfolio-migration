import type { ProjectChapterEvidence } from "@/lib/project-evidence/types";

export const TIKTOK_EVIDENCE = [
  {
    chapterId: "tt-brief",
    dominantClaim: {
      id: "tt-brief-deliverable",
      text: "The internship deliverable was three static layered template directions built around one fixed catalog slot map.",
      class: "descriptive",
      state: "built",
    },
    interpretation:
      "The brief separated fixed product structure from variable art direction before discussing process or outcome.",
    caveat:
      "The deliverable was static layered Photoshop files, not ownership of downstream production or ad performance.",
    proofs: [
      {
        id: "tt-brief-facts",
        label: "Dynamic Showcase Ads brief facts",
        kind: "structured",
        role: "dominant",
        surface: "briefFacts definition list",
        surfaceChapterId: "tt-brief",
        job: "State role, team, intended use, deliverable, fixed parts, and variable parts in one scannable block.",
        proves:
          "The three directions shared product slots while type, color, texture, and supporting graphics changed.",
        limitation:
          "The brief facts do not establish which direction was strongest or why one shipped.",
      },
    ],
  },
  {
    chapterId: "tt-research",
    dominantClaim: {
      id: "tt-research-three-directions",
      text: "Five subculture references narrowed to three directions because those directions created distinct visual systems inside the same slot map.",
      class: "interpretive",
      state: "observed",
    },
    interpretation:
      "The selection criterion was meaningful visual-system separation rather than simply producing more themes.",
    caveat:
      "The rationale reflects design judgment and internal review, not measured audience preference.",
    proofs: [
      {
        id: "tt-direction-comparison",
        label: "Three-direction visual-system comparison",
        kind: "comparison",
        role: "dominant",
        surface: "TikTokTemplateSystem and process cards",
        surfaceChapterId: "tt-system",
        job: "Let readers compare how the same slot map changes across the three selected directions.",
        proves:
          "Dopamine Dressing, e-Boy/e-Girl, and Light Academia create materially different systems from the same fixed structure.",
        limitation:
          "The visual proof appears in the following chapter rather than beside the selection rationale.",
        placementNote:
          "Composition review should decide whether a small three-direction preview belongs in the Choose chapter.",
      },
    ],
  },
  {
    chapterId: "tt-system",
    dominantClaim: {
      id: "tt-system-shared-anatomy",
      text: "One slot map supported three distinct visual systems with limited modularity between selected parts.",
      class: "behavioral",
      state: "built",
    },
    interpretation:
      "The layered files kept each direction coherent while allowing a small number of parts to move across related systems.",
    caveat:
      "The proposed modularity was limited and most parts stayed within their original direction.",
    proofs: [
      {
        id: "tt-template-system",
        label: "Interactive template-system comparison",
        kind: "interactive",
        role: "dominant",
        surface: "TikTokTemplateSystem",
        surfaceChapterId: "tt-system",
        job: "Expose the shared slot anatomy and visual differences across all three directions.",
        proves:
          "The same product structure can support three clearly different art-direction systems.",
        limitation:
          "The comparison demonstrates visual-system behavior, not ad effectiveness or downstream production performance.",
      },
      {
        id: "tt-process-cards",
        label: "Sketch, static template, and iteration notes",
        kind: "sequence",
        role: "supporting",
        surface: ".tt-preview-process-list",
        surfaceChapterId: "tt-system",
        job: "Show how each direction moved from sketch to layered static output with paraphrased review notes.",
        proves:
          "Each direction was developed as an authored process rather than a single finished image.",
        limitation:
          "The notes are paraphrases and do not document every review or production decision.",
      },
    ],
  },
  {
    chapterId: "tt-outcome",
    dominantClaim: {
      id: "tt-outcome-light-academia",
      text: "Light Academia shipped in the launch library and was later selected by American Eagle through Global Creative Lab.",
      class: "outcome",
      state: "shipped",
    },
    interpretation:
      "The ordered critique, response, and shipped result show how one direction improved and became the delivered outcome.",
    caveat:
      "The American Eagle relationship was indirect, and the case study contains no ad-performance evidence or downstream production ownership claim.",
    proofs: [
      {
        id: "tt-light-academia-sequence",
        label: "Critique, response, and shipped-result sequence",
        kind: "sequence",
        role: "dominant",
        surface: ".tt-outcome-sequence",
        surfaceChapterId: "tt-outcome",
        job: "Place the review note, design response, and shipped static template in causal order.",
        proves:
          "Light Academia was refined after Global Creative Lab feedback and entered the launch library.",
        limitation:
          "The sequence does not establish why American Eagle selected the direction or how it performed.",
      },
    ],
  },
] as const satisfies readonly ProjectChapterEvidence[];
