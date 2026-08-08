import type { ProjectChapterEvidence } from "@/lib/project-evidence/types";

export const FRESH_GREENS_EVIDENCE = [
  {
    chapterId: "fg-problem",
    dominantClaim: {
      id: "fg-problem-hypothesis",
      text: "A personal safety concern became a research hypothesis rather than a universal claim.",
      class: "interpretive",
      state: "observed",
    },
    interpretation:
      "The project began by testing whether the planning and vigilance Myles carried also appeared in other Black drivers' experiences.",
    caveat:
      "The first-person account and Green Book lineage establish context, not population prevalence or historical equivalence.",
    proofs: [
      {
        id: "fg-origin-narrative",
        label: "First-person origin and present planning behavior",
        kind: "narrative",
        role: "dominant",
        surface: "fg-problem chapter narrative",
        surfaceChapterId: "fg-problem",
        job: "State the originating experience and explicitly bound it as a hypothesis.",
        proves:
          "The project began from concrete night-driving behaviors and concerns rather than an invented abstract brief.",
        limitation:
          "One person's experience cannot establish a population-wide need.",
      },
      {
        id: "fg-green-book-reference",
        label: "Smithsonian Green Book reference",
        kind: "reference",
        role: "supporting",
        surface: "Smithsonian NMAAHC source link",
        surfaceChapterId: "fg-problem",
        job: "Ground the historical lineage in an external primary cultural institution.",
        proves:
          "The Green Book used the publishing medium of its era to share travel knowledge with Black travelers.",
        limitation:
          "The reference does not make Fresh Greens a digital successor or validate the product concept.",
      },
    ],
  },
  {
    chapterId: "fg-research",
    dominantClaim: {
      id: "fg-research-three-problems",
      text: "Six interviews widened the problem into Plan, Respond, and Trust.",
      class: "interpretive",
      state: "observed",
    },
    interpretation:
      "Existing driver knowledge became three product requirements instead of a generic safety feature list.",
    caveat:
      "The interview counts describe six participants and do not represent every Black driver.",
    proofs: [
      {
        id: "fg-evidence-boundaries",
        label: "Plan, Respond, and Trust synthesis",
        kind: "structured",
        role: "dominant",
        surface: ".fg-evidence-boundaries",
        surfaceChapterId: "fg-research",
        job: "Connect bounded interview findings to the three product problems.",
        proves:
          "Participants described recurring planning, stress-response, and community-trust behaviors that shaped the prototype.",
        limitation:
          "The synthesis is qualitative and based on a six-person sample.",
      },
    ],
  },
  {
    chapterId: "fg-design",
    dominantClaim: {
      id: "fg-design-inspectable-routes",
      text: "The prototype makes route alternatives inspectable and carries a useful daylight window into a local reminder.",
      class: "behavioral",
      state: "built",
    },
    interpretation:
      "Route chips and source cards explain the preference; a one-shot local reminder lets the driver act on the suggested departure without keeping the app open.",
    caveat:
      "An explainable preference and a working reminder do not prove that the preferred route is safer or that the driver changes behavior.",
    proofs: [
      {
        id: "fg-pivot-journey",
        label: "Route-planning pivot sequence",
        kind: "sequence",
        role: "dominant",
        surface: "PivotJourney",
        surfaceChapterId: "fg-design",
        job: "Show the move from a Google Maps feature to an inspectable standalone route preview.",
        proves:
          "The current prototype exposes alternative-route conditions, sources, and scoring cues before selection.",
        limitation:
          "The sequence demonstrates interface behavior, not real-world route quality.",
      },
      {
        id: "fg-departure-reminder",
        label: "Daylight departure reminder",
        kind: "sequence",
        role: "supporting",
        surface: "DepartureReminderEvidence",
        surfaceChapterId: "fg-design",
        job: "Show how a suggested daylight window becomes a permission-gated, one-time local notification.",
        proves:
          "The prototype requests notification access at the moment of intent and schedules a device reminder for the suggested departure.",
        limitation:
          "The reminder proves implemented behavior, not that a driver leaves at that time or has a safer trip.",
      },
      {
        id: "fg-architecture-diagram",
        label: "Route-input architecture",
        kind: "structured",
        role: "supporting",
        surface: "ArchitectureDiagram",
        surfaceChapterId: "fg-design",
        job: "Explain how public and community inputs become route-facing information.",
        proves:
          "The design has an explicit model for translating multiple input types into route explanation.",
        limitation:
          "The architecture documents intended logic and does not establish data completeness or accuracy.",
      },
    ],
  },
  {
    chapterId: "fg-pulled-over",
    dominantClaim: {
      id: "fg-pulled-over-stress-support",
      text: "The prototype keeps one-thumb and offline support available across stress states.",
      class: "behavioral",
      state: "built",
    },
    interpretation:
      "Support stays hidden until requested, then prioritizes calm language, recording, trusted contacts, and offline paths.",
    caveat:
      "The flow demonstrates prototype behavior, not evidence that it improves a police encounter or roadside emergency.",
    proofs: [
      {
        id: "fg-pulled-over-journey",
        label: "Pulled-over support reconstruction",
        kind: "interactive",
        role: "dominant",
        surface: "PulledOverJourney",
        surfaceChapterId: "fg-pulled-over",
        job: "Demonstrate the one-thumb reveal and sequence of stress-state support.",
        proves:
          "The prototype exposes recording, reassurance, questions, contacts, and offline help from one control.",
        limitation:
          "The reconstruction has not been stress-tested in real encounters or configured device failure modes.",
      },
    ],
  },
  {
    chapterId: "fg-trust",
    dominantClaim: {
      id: "fg-trust-visible-uncertainty",
      text: "The trust model should preserve individual accounts, expose uncertainty, and increase ranking influence only with corroboration.",
      class: "interpretive",
      state: "proposed",
    },
    interpretation:
      "Community knowledge stays specific and reviewable instead of being flattened into an official-looking safety fact.",
    caveat:
      "The current prototype lets one report affect one scored zone and does not yet show visible provenance or differentiated trust levels.",
    proofs: [
      {
        id: "fg-moderation-flow",
        label: "Contribution moderation sequence",
        kind: "sequence",
        role: "dominant",
        surface: ".fg-moderation",
        surfaceChapterId: "fg-trust",
        job: "Show how reports enter review and reach a human decision.",
        proves:
          "The current concept includes a reviewable contribution and moderation path.",
        limitation:
          "The sequence does not implement weighted corroboration, public moderation transparency, or contributor trust levels.",
      },
      {
        id: "fg-report-detail",
        label: "Structured firsthand contribution form",
        kind: "image",
        role: "supporting",
        surface: "report-detail screenshot",
        surfaceChapterId: "fg-trust",
        job: "Show how structured tags keep one account specific while allowing context.",
        proves:
          "The contribution interface records place type, reasons, and optional experience detail as one person's report.",
        limitation:
          "The screen does not expose contributor provenance or corroboration status.",
      },
    ],
  },
  {
    chapterId: "fg-scope",
    dominantClaim: {
      id: "fg-scope-working-prototype",
      text: "A working React Native prototype now spans planning, local reminders, stress-state support, contribution, and moderation, while route safety and efficacy still need proof.",
      class: "outcome",
      state: "needs-proof",
      reopenWhen:
        "Cross-region route-quality, stress-state, failure-mode, and trust-model testing is completed with more Black drivers.",
    },
    interpretation:
      "The project can show a complete research-to-product chain while keeping implementation scope separate from real-world outcomes.",
    caveat:
      "The scope ledger is implementation evidence and does not establish that the product makes routes or encounters safer.",
    proofs: [
      {
        id: "fg-scope-ledger",
        label: "Built-now and what-remains ledger",
        kind: "scope-ledger",
        role: "dominant",
        surface: ".fg-scope-grid",
        surfaceChapterId: "fg-scope",
        job: "Separate implemented Plan, Respond, and Trust behavior from the tests and safeguards still required.",
        proves:
          "The current prototype includes route comparison, departure and refuel reminders, five stress-state paths, contribution, and moderation flows.",
        limitation:
          "The ledger documents authored implementation status rather than independently measured outcomes.",
      },
    ],
  },
] as const satisfies readonly ProjectChapterEvidence[];
