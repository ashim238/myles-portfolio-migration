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
        id: "tt-brief-summary",
        label: "Dynamic Showcase Ads deliverable summary",
        kind: "narrative",
        role: "dominant",
        surface: "tt-brief chapter narrative",
        surfaceChapterId: "tt-brief",
        job: "State the shared slot map, three directions, and static layered-file deliverable without repeating the recruiter summary.",
        proves:
          "The three directions shared product placement while type, color, texture, and supporting graphics changed.",
        limitation:
          "The summary does not establish which direction was strongest or why one shipped.",
      },
    ],
  },
  {
    chapterId: "tt-research",
    dominantClaim: {
      id: "tt-research-three-directions",
      text: "Five subculture references narrowed to three directions because those directions felt clearly different inside the same catalog structure.",
      class: "interpretive",
      state: "observed",
    },
    interpretation:
      "The selection criterion was meaningful art-direction separation rather than producing more themes or changing the product structure.",
    caveat:
      "The rationale reflects design judgment and internal review, not measured audience preference.",
    proofs: [
      {
        id: "tt-direction-comparison",
        label: "Three-direction signal strip",
        kind: "structured",
        role: "dominant",
        surface: ".tt-direction-proof",
        surfaceChapterId: "tt-research",
        job: "Show the tonal difference between the selected directions without repeating the full templates or exposing a taxonomy table.",
        proves:
          "Dopamine Dressing, e-Boy/e-Girl, and Light Academia use distinct color and visual tone inside the same fixed catalog structure.",
        limitation:
          "The strip does not show every type, texture, or graphic decision; the full interactive comparison follows in Build.",
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
        job: "Expose the shared slot anatomy and visual differences across all three directions in one place.",
        proves:
          "The same product structure can support three clearly different art-direction systems.",
        limitation:
          "The comparison demonstrates visual-system behavior, not ad effectiveness or downstream production performance.",
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
