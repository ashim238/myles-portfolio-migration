import {
  CASE_STUDY_CHAPTERS,
  type ProjectChapterVariant,
} from "@/lib/project-chapters";

export const EVIDENCE_STATES = [
  "built",
  "shipped",
  "confirmed",
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
  confirmed: "Confirmed",
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
      "Research synthesis, system thinking, and a working browser demo.",
    chapters: [
      {
        chapterId: "nv-intro",
        dominantClaim:
          "The heatmap could show people where to go, but not what to do when they got there.",
        claimClass: "interpretive",
        evidenceState: "observed",
        dominantProof: {
          id: "navi-heatmap-reconstruction",
          label: "Manhattan heatmap reconstruction",
          kind: "interaction",
        },
        interpretation:
          "The first artifact redirected attention. It did not help someone understand what a neighborhood or activity had to offer.",
        caveat:
          "The heatmap was an exploratory concept, not live tourist-density or geo-analytics data.",
      },
      {
        chapterId: "nv-insights",
        dominantClaim:
          "Resident and stakeholder responses asked for deeper engagement with neighborhoods and what they offered.",
        claimClass: "interpretive",
        evidenceState: "observed",
        dominantProof: {
          id: "navi-survey-audit",
          label: "Survey highlights and platform audit",
          kind: "structured-data",
        },
        interpretation:
          "Overcrowding and the lack of authentic experiences moved the team beyond the heatmap and toward Learn, Plan, Go.",
        caveat:
          "Fourteen responses, including two local businesses, informed the concept but do not represent all New Yorkers.",
      },
      {
        chapterId: "nv-framework",
        dominantClaim:
          "Learn adds neighborhood and activity context. Plan shows requirements and cost. Go handles travel options. Booking remains a separate module.",
        claimClass: "interpretive",
        evidenceState: "proposed",
        dominantProof: {
          id: "navi-research-artifacts",
          label: "Research and product-scope board",
          kind: "structured-data",
        },
        interpretation:
          "I used the personas and journey maps to adjust my teammate's original information architecture, then built the Figma design system.",
        caveat:
          "The studio project ended before engineering handoff, and the intended tag-ranking logic was not wired into the later React build.",
      },
      {
        chapterId: "nv-build",
        dominantClaim:
          "The team tested the Figma homepage and search, then I later rebuilt the component system and individual booking flow in React.",
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
          "Student feedback reduced card copy and tags and aligned card heights. The later build demonstrates browsing, search, host detail, and a sample reservation.",
        caveat:
          "The semester ended before the team could test Learn, Plan, Go or booking. The current Go view lists travel options but does not calculate a live route from current location.",
      },
      {
        chapterId: "nv-outcome",
        dominantClaim:
          "The current browser demo supports the individual booking flow, while resident, traveler, and host validation remains open.",
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
          "The rebuild makes the individual flow inspectable. Group coordination, deeper Learn pages, and host onboarding remain future work.",
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
          "My own experience gave me the first question. Six interviews helped me see which parts other Black drivers also planned around.",
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
          "I started with a South Jersey drive, then spoke with six Black drivers to learn whether the discomfort was only mine.",
        caveat:
          "The Green Book is design lineage, not proof that Fresh Greens is a digital successor.",
      },
      {
        chapterId: "fg-research",
        dominantClaim:
          "Six interviews gave me three problems to work on: planning with more context, finding support under stress, and knowing why a recommendation should be trusted.",
        claimClass: "interpretive",
        evidenceState: "observed",
        dominantProof: {
          id: "fresh-greens-problem-boundaries",
          label: "Plan, Respond, Trust evidence boundaries",
          kind: "structured-data",
        },
        interpretation:
          "Drivers already paired navigation with daylight, road conditions, and advice from people they trusted.",
        caveat: "Six interviews do not represent every Black driver.",
      },
      {
        chapterId: "fg-design",
        dominantClaim:
          "The route preview lets drivers compare daylight and route conditions before choosing. A local reminder brings that plan back at departure time.",
        claimClass: "behavioral",
        evidenceState: "built",
        dominantProof: {
          id: "fresh-greens-pivot-journey",
          label: "Route-planning pivot journey",
          kind: "sequence",
        },
        supportingProofs: [
          {
            id: "fg-departure-reminder",
            label: "Implemented daylight departure reminder",
            kind: "interaction",
          },
          {
            id: "fresh-greens-architecture",
            label: "Public and community data architecture",
            kind: "diagram",
          },
        ],
        interpretation:
          "Route cards show some of the reasons behind a recommendation. Fresh Greens waits until someone taps Schedule before asking for notification access.",
        caveat:
          "The prototype does not prove that a preferred route is safer. Its current Safest route label overstates the evidence, and the reminder has not been shown to change behavior.",
      },
      {
        chapterId: "fg-pulled-over",
        dominantClaim:
          "One thumb-reachable control reveals four support paths, with an on-device recording path and user-controlled contact handoffs.",
        claimClass: "behavioral",
        evidenceState: "built",
        dominantProof: {
          id: "fresh-greens-pulled-over-journey",
          label: "Pulled-over support journey",
          kind: "sequence",
        },
        interpretation:
          "The response flow reduces searching, requests microphone access after the driver answers, records when available, and keeps trusted-contact actions visible.",
        caveat:
          "Prototype behavior is not evidence that the flow improves a real encounter.",
      },
      {
        chapterId: "fg-trust",
        dominantClaim:
          "Each report stays tied to a place and category. Sensitive reports omit attribution, while other reports retain only current-account ownership. Route ranking does not yet weigh corroboration from distinct contributors or show contributor provenance and trust tiers.",
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
          "Reports stay on the device first. With Supabase configured, they can enter the moderation path.",
        caveat:
          "One report can affect route ranking now. Corroboration from distinct contributors, visible provenance, and route-level trust tiers are not built yet.",
      },
      {
        chapterId: "fg-scope",
        dominantClaim:
          "Fresh Greens is a working React Native prototype across more than 26 screens. It hasn't shown that routes are safer, that the support flow holds up under stress, or that the explanations earn trust.",
        claimClass: "outcome",
        evidenceState: "needs-proof",
        dominantProof: {
          id: "fresh-greens-scope-ledger",
          label: "Built-now and remaining-work ledger",
          kind: "outcome-note",
        },
        supportingProofs: [
          {
            id: "fresh-greens-en-route-video",
            label: "Working en-route prototype recording",
            kind: "interaction",
          },
        ],
        interpretation:
          "The browser recording shows the current navigation flow. The ledger separates what is working from what I still need to test.",
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
          "Headlines, body copy, imagery, links, and middle-module order can change. Header and footer placement, spacing, type, and dividers stay fixed.",
        caveat:
          "The interactive switcher shows the weekly and event templates, not the welcome email.",
      },
      {
        chapterId: "uf-figma",
        dominantClaim:
          "Practice sends exposed Gmail's 102 KB clipping threshold and dark-mode inversion before launch.",
        claimClass: "behavioral",
        evidenceState: "shipped",
        dominantProof: {
          id: "fafsa-figma-mailchimp",
          label: "Figma-to-Mailchimp implementation comparison",
          kind: "comparison",
        },
        interpretation:
          "I rebuilt the live template with a flatter hierarchy, fewer wrappers, and Mailchimp-native blocks.",
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
      "Visual-system judgment, art direction, and a confirmed launch-library artifact.",
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
          "The slot map stayed constant. Only a few parts could cross between Light Academia and e-Boy/e-Girl.",
        caveat:
          "Limited cross-direction modularity was a proposal made while building the files.",
      },
      {
        chapterId: "tt-outcome",
        dominantClaim:
          "Light Academia was refined through internal critique and entered the launch library.",
        claimClass: "outcome",
        evidenceState: "confirmed",
        dominantProof: {
          id: "tiktok-light-academia-sequence",
          label: "Critique, response, and launch-library sequence",
          kind: "sequence",
        },
        interpretation:
          "The final direction records what changed during internal review. It does not show audience response.",
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
