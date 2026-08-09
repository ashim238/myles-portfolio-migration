import {
  CASE_STUDY_CHAPTERS,
  type ProjectChapterVariant,
} from "@/lib/project-chapters";

export const EVIDENCE_STATES = [
  "built",
  "shipped",
  "observed",
  "proposed",
  "needs-proof",
] as const;

export type EvidenceState = (typeof EVIDENCE_STATES)[number];

export const CLAIM_CLASSES = [
  "descriptive",
  "behavioral",
  "interpretive",
  "outcome",
  "causal",
] as const;

export type ClaimClass = (typeof CLAIM_CLASSES)[number];

export const EVIDENCE_ARTIFACT_KINDS = [
  "narrative",
  "image",
  "comparison",
  "diagram",
  "structured-data",
  "interaction",
  "sequence",
  "outcome-note",
] as const;

export type EvidenceArtifactKind =
  (typeof EVIDENCE_ARTIFACT_KINDS)[number];

export const EVIDENCE_ROLES = [
  "context",
  "dominant",
  "supporting",
] as const;

export type EvidenceRole = (typeof EVIDENCE_ROLES)[number];

export type EvidenceArtifact = {
  readonly id: string;
  readonly label: string;
  readonly kind: EvidenceArtifactKind;
};

export type ChapterIdFor<P extends ProjectChapterVariant> =
  (typeof CASE_STUDY_CHAPTERS)[P][number]["id"];

export type ChapterEvidenceMap<
  P extends ProjectChapterVariant = ProjectChapterVariant,
> = {
  readonly chapterId: ChapterIdFor<P>;
  readonly dominantClaim: string;
  readonly claimClass: ClaimClass;
  readonly evidenceState: EvidenceState;
  readonly dominantProof: EvidenceArtifact;
  readonly supportingProofs?: readonly EvidenceArtifact[];
  readonly interpretation: string;
  readonly caveat?: string;
};

export type ProjectEvidenceMap<
  P extends ProjectChapterVariant = ProjectChapterVariant,
> = {
  readonly project: P;
  readonly portfolioSignal: string;
  readonly chapters: readonly ChapterEvidenceMap<P>[];
};

type ReaderEvidenceMaps = {
  readonly [P in ProjectChapterVariant]: ProjectEvidenceMap<P>;
};

export const EVIDENCE_STATE_LABELS = {
  built: "Built",
  shipped: "Shipped",
  observed: "Observed",
  proposed: "Proposed",
  "needs-proof": "Needs proof",
} as const satisfies Record<EvidenceState, string>;

export const CLAIM_CLASS_LABELS = {
  descriptive: "Description",
  behavioral: "Behavior",
  interpretive: "Interpretation",
  outcome: "Outcome",
  causal: "Causal",
} as const satisfies Record<ClaimClass, string>;

export const READER_EVIDENCE_MAPS = {
  navi: {
    project: "navi",
    portfolioSignal:
      "Research synthesis, system thinking, and a working browser product.",
    chapters: [
      {
        chapterId: "nv-intro",
        dominantClaim:
          "The early heatmap tested redistribution, but movement alone did not address how visitors engaged after arrival.",
        claimClass: "interpretive",
        evidenceState: "observed",
        dominantProof: {
          id: "navi-heatmap-reconstruction",
          label: "Manhattan heatmap reconstruction",
          kind: "interaction",
        },
        interpretation:
          "The first artifact made movement the outcome, which exposed the need for a stronger post-arrival experience.",
        caveat:
          "The heatmap was an exploratory concept, not live tourist-density or geo-analytics data.",
      },
      {
        chapterId: "nv-insights",
        dominantClaim:
          "Resident and stakeholder responses, plus the platform audit, shifted the brief toward neighborhood context and planning confidence.",
        claimClass: "interpretive",
        evidenceState: "observed",
        dominantProof: {
          id: "navi-survey-audit",
          label: "Survey highlights and platform audit",
          kind: "structured-data",
        },
        interpretation:
          "Overcrowding and the lack of authentic experiences appeared often enough to change the concept direction.",
        caveat:
          "Fourteen responses, including two local businesses, informed the concept but do not represent all New Yorkers.",
      },
      {
        chapterId: "nv-framework",
        dominantClaim:
          "Archetypes, journey stages, and flows translated the research into Learn, Plan, Go.",
        claimClass: "interpretive",
        evidenceState: "proposed",
        dominantProof: {
          id: "navi-research-artifacts",
          label: "Research and product-scope board",
          kind: "structured-data",
        },
        interpretation:
          "The artifacts connect observed needs to product areas and the individual booking flow.",
        caveat:
          "These remained internal planning artifacts because the studio project ended before engineering handoff.",
      },
      {
        chapterId: "nv-build",
        dominantClaim:
          "The solo rebuild turns Learn, Plan, Go into a working React booking flow.",
        claimClass: "behavioral",
        evidenceState: "built",
        dominantProof: {
          id: "navi-booking-demo",
          label: "Working browser booking flow",
          kind: "interaction",
        },
        supportingProofs: [
          {
            id: "navi-component-system",
            label: "React component system",
            kind: "interaction",
          },
        ],
        interpretation:
          "The current build demonstrates feed browsing, neighborhood search, host detail, and a sample reservation with one component system.",
      },
      {
        chapterId: "nv-outcome",
        dominantClaim:
          "The current browser product demonstrates the core flow, while resident, traveler, and host validation remains open.",
        claimClass: "outcome",
        evidenceState: "needs-proof",
        dominantProof: {
          id: "navi-validation-ledger",
          label: "Working-now and next-research ledger",
          kind: "outcome-note",
        },
        supportingProofs: [
          {
            id: "navi-booking-demo",
            label: "Working browser booking flow",
            kind: "interaction",
          },
        ],
        interpretation:
          "The rebuild makes the design inspectable and testable instead of treating the Figma concept as the final answer.",
        caveat:
          "No user or host testing has established that the current choices are settled.",
      },
    ],
  },
  "fresh-greens": {
    project: "fresh-greens",
    portfolioSignal:
      "Research-to-product reasoning plus solo design and engineering.",
    chapters: [
      {
        chapterId: "fg-problem",
        dominantClaim:
          "A personal safety hypothesis became a research question about what route planning leaves Black drivers to carry themselves.",
        claimClass: "interpretive",
        evidenceState: "observed",
        dominantProof: {
          id: "fresh-greens-origin-and-interviews",
          label: "Personal context and six-interview research frame",
          kind: "narrative",
        },
        supportingProofs: [
          {
            id: "fresh-greens-lineage-source",
            label: "Smithsonian Green Book source",
            kind: "narrative",
          },
        ],
        interpretation:
          "The personal experience set the hypothesis, while interviews tested which concerns extended beyond one route.",
        caveat:
          "The Green Book is design lineage, not proof that Fresh Greens is a digital successor.",
      },
      {
        chapterId: "fg-research",
        dominantClaim:
          "Six interviews surfaced three linked needs: inspect routes, respond under stress, and judge community knowledge.",
        claimClass: "interpretive",
        evidenceState: "observed",
        dominantProof: {
          id: "fresh-greens-problem-boundaries",
          label: "Plan, Respond, Trust evidence boundaries",
          kind: "structured-data",
        },
        interpretation:
          "The interview themes widened the original route-safety hypothesis into three product problems.",
        caveat: "Six interviews do not represent every Black driver.",
      },
      {
        chapterId: "fg-design",
        dominantClaim:
          "The prototype makes route factors and their sources inspectable before a driver chooses.",
        claimClass: "behavioral",
        evidenceState: "built",
        dominantProof: {
          id: "fresh-greens-pivot-journey",
          label: "Route-planning pivot journey",
          kind: "sequence",
        },
        supportingProofs: [
          {
            id: "fresh-greens-architecture",
            label: "Public and community data architecture",
            kind: "diagram",
          },
        ],
        interpretation:
          "Route chips and source cards explain why the prototype prefers one route over another.",
        caveat:
          "The prototype does not prove that a preferred route is safer.",
      },
      {
        chapterId: "fg-pulled-over",
        dominantClaim:
          "One thumb-reachable control reveals calm, offline support only when the driver requests it.",
        claimClass: "behavioral",
        evidenceState: "built",
        dominantProof: {
          id: "fresh-greens-pulled-over-journey",
          label: "Pulled-over support journey",
          kind: "sequence",
        },
        interpretation:
          "The response flow reduces searching and keeps reassurance and trusted-contact actions visible.",
        caveat:
          "Prototype behavior is not evidence that the flow improves a real encounter.",
      },
      {
        chapterId: "fg-trust",
        dominantClaim:
          "Structured reports and moderation keep accounts specific, while weighted trust and visible provenance remain unbuilt.",
        claimClass: "behavioral",
        evidenceState: "needs-proof",
        dominantProof: {
          id: "fresh-greens-report-moderation",
          label: "Contribution and moderation flow",
          kind: "sequence",
        },
        supportingProofs: [
          {
            id: "fresh-greens-report-detail",
            label: "Structured contribution form",
            kind: "image",
          },
        ],
        interpretation:
          "The prototype keeps reports reviewable instead of treating one account as universal fact.",
        caveat:
          "One report can affect route ranking now. Corroboration weighting, provenance, and trust levels are intended safeguards.",
      },
      {
        chapterId: "fg-scope",
        dominantClaim:
          "The working prototype connects interview themes to more than 26 screens, while safety, stress-state, and trust outcomes still require testing.",
        claimClass: "outcome",
        evidenceState: "needs-proof",
        dominantProof: {
          id: "fresh-greens-scope-ledger",
          label: "Built-now and remaining-work ledger",
          kind: "outcome-note",
        },
        interpretation:
          "The prototype makes the research-to-product decisions inspectable and ready for broader validation.",
        caveat:
          "It does not establish safer routes or improved outcomes.",
      },
    ],
  },
  understandingfafsa: {
    project: "understandingfafsa",
    portfolioSignal:
      "Operational constraints, modular content systems, and a qualified observed result.",
    chapters: [
      {
        chapterId: "uf-context",
        dominantClaim:
          "The newsletter had to carry the refreshed brand inside a founder-run weekly workflow.",
        claimClass: "descriptive",
        evidenceState: "observed",
        dominantProof: {
          id: "fafsa-before-after",
          label: "Old and redesigned mobile newsletter comparison",
          kind: "comparison",
        },
        interpretation:
          "The redesign focused on scanning, mobile hierarchy, and a system the founder could operate.",
        caveat: "The project scope was email-only.",
      },
      {
        chapterId: "uf-audit",
        dominantClaim:
          "A review of more than 120 newsletters converted recurring communication problems into explicit system rules.",
        claimClass: "interpretive",
        evidenceState: "observed",
        dominantProof: {
          id: "fafsa-audit-rules",
          label: "Audit findings paired with system rules",
          kind: "structured-data",
        },
        interpretation:
          "Research references became operational rules for hierarchy, tone, branding, and scanning.",
        caveat: "The audit was completed with one collaborator.",
      },
      {
        chapterId: "uf-locked",
        dominantClaim:
          "Fixed hierarchy and swappable content let the founder assemble three send types without changing the system.",
        claimClass: "behavioral",
        evidenceState: "built",
        dominantProof: {
          id: "fafsa-composer-demo",
          label: "Interactive template switcher and newsletter composer",
          kind: "interaction",
        },
        supportingProofs: [
          {
            id: "fafsa-locked-swappable",
            label: "Locked-versus-swappable rule view",
            kind: "comparison",
          },
        ],
        interpretation:
          "The rules separate weekly content changes from the structure that protects consistency.",
        caveat: "The counselor toolkit remains in progress.",
      },
      {
        chapterId: "uf-figma",
        dominantClaim:
          "The Figma system was simplified into a Mailchimp-native template that stays editable and below Gmail's HTML constraint.",
        claimClass: "behavioral",
        evidenceState: "shipped",
        dominantProof: {
          id: "fafsa-figma-mailchimp",
          label: "Figma-to-Mailchimp implementation comparison",
          kind: "comparison",
        },
        interpretation:
          "Flattened hierarchy and native blocks reduced unnecessary HTML while preserving the brand.",
        caveat:
          "Image compression reduced download weight, not the HTML source Gmail measures.",
      },
      {
        chapterId: "uf-results",
        dominantClaim:
          "The modular kit shipped, and the first redesigned send recorded a qualified open-rate increase.",
        claimClass: "outcome",
        evidenceState: "observed",
        dominantProof: {
          id: "fafsa-first-send-result",
          label: "Observed first-send Mailchimp result",
          kind: "outcome-note",
        },
        supportingProofs: [
          {
            id: "fafsa-shipped-kit",
            label: "Master template, modular blocks, and three variants",
            kind: "structured-data",
          },
        ],
        interpretation:
          "The result is useful context alongside the delivered system and founder workflow.",
        caveat:
          "The ~52.6% open rate, with MPP excluded, was not a controlled attribution test and does not prove the redesign caused the change.",
      },
    ],
  },
  tiktok: {
    project: "tiktok",
    portfolioSignal:
      "Visual-system judgment, art direction, and a shipped creative artifact.",
    chapters: [
      {
        chapterId: "tt-brief",
        dominantClaim:
          "Dynamic Showcase Ads needed reusable catalog templates with fixed product slots and flexible art direction.",
        claimClass: "descriptive",
        evidenceState: "observed",
        dominantProof: {
          id: "tiktok-brief-facts",
          label: "DSA brief and fixed-versus-variable fact grid",
          kind: "structured-data",
        },
        interpretation:
          "The constraint separated the shared slot map from type, color, texture, and supporting graphics.",
      },
      {
        chapterId: "tt-research",
        dominantClaim:
          "Three directions moved forward because each created a distinct visual system inside the same slot map.",
        claimClass: "interpretive",
        evidenceState: "observed",
        dominantProof: {
          id: "tiktok-direction-rationale",
          label: "Trend comparison and direction rationale",
          kind: "comparison",
        },
        interpretation:
          "Dopamine Dressing, e-Boy/e-Girl, and Light Academia covered meaningfully different visual territories.",
      },
      {
        chapterId: "tt-system",
        dominantClaim:
          "Layered files separated type, color, texture, and graphics so modularity could be tested without changing the slot map.",
        claimClass: "behavioral",
        evidenceState: "built",
        dominantProof: {
          id: "tiktok-template-system",
          label: "Interactive template-system explanation",
          kind: "interaction",
        },
        supportingProofs: [
          {
            id: "tiktok-sketch-final-sequence",
            label: "Sketch, final, and iteration-note sequence",
            kind: "sequence",
          },
        ],
        interpretation:
          "Most parts stayed within one visual system, while a few could cross between Light Academia and e-Boy/e-Girl.",
        caveat:
          "Limited cross-direction modularity was a proposal made while building the files.",
      },
      {
        chapterId: "tt-outcome",
        dominantClaim:
          "Light Academia was refined from critique into the one template that entered the launch library.",
        claimClass: "outcome",
        evidenceState: "shipped",
        dominantProof: {
          id: "tiktok-light-academia-sequence",
          label: "Critique, response, and shipped-result sequence",
          kind: "sequence",
        },
        interpretation:
          "The final direction kept the fixed product slot while making the editorial system more deliberate and upbeat.",
        caveat:
          "American Eagle selection was learned later through Global Creative Lab. No performance result is claimed.",
      },
    ],
  },
} as const satisfies ReaderEvidenceMaps;

export function getEvidenceStateLabel(state: EvidenceState): string {
  return EVIDENCE_STATE_LABELS[state];
}

export function getClaimClassLabel(claimClass: ClaimClass): string {
  return CLAIM_CLASS_LABELS[claimClass];
}

export function getChapterEvidence(
  project: ProjectChapterVariant,
  chapterId: string,
): ChapterEvidenceMap {
  const chapters = READER_EVIDENCE_MAPS[project]
    .chapters as readonly ChapterEvidenceMap[];
  const chapter = chapters.find((entry) => entry.chapterId === chapterId);

  if (!chapter) {
    throw new Error(`Missing Reader evidence map for ${project}:${chapterId}`);
  }

  return chapter;
}
