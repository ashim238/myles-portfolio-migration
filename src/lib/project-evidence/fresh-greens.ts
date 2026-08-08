import type { ProjectChapterEvidence } from "@/lib/project-evidence/types";

export const FRESH_GREENS_EVIDENCE = [
  {
    chapterId: "fg-problem",
    dominantClaim: {
      id: "fg-problem-hypothesis",
      text: "A personal safety concern became a research question rather than a universal claim.",
      class: "interpretive",
      state: "observed",
    },
    interpretation:
      "The thesis tested whether the planning and vigilance Myles carried while driving at night also appeared in other Black drivers' experiences.",
    caveat:
      "The first-person account and Green Book lineage establish context, not population prevalence or historical equivalence.",
    proofs: [
      {
        id: "fg-origin-narrative",
        label: "First-person origin and existing planning behavior",
        kind: "narrative",
        role: "dominant",
        surface: "fg-problem chapter narrative",
        surfaceChapterId: "fg-problem",
        job: "Explain the experience that started the thesis and why it needed research beyond one person.",
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
          "The Green Book shared travel knowledge with Black travelers when mainstream systems excluded them.",
        limitation:
          "The reference does not make Fresh Greens a digital successor or validate the product concept.",
      },
    ],
  },
  {
    chapterId: "fg-research",
    dominantClaim: {
      id: "fg-research-customer-problems",
      text: "Six interviews surfaced two customer problems and four route factors.",
      class: "interpretive",
      state: "observed",
    },
    interpretation:
      "Safety planning lived outside navigation, and people wanted to understand who or what shaped a route recommendation. Daylight, police presence, road quality, wildlife, and community knowledge defined the brief.",
    caveat:
      "The findings describe six participants and do not represent every Black driver.",
    proofs: [
      {
        id: "fg-story-brief",
        label: "Problem, opportunity, and goal brief",
        kind: "structured",
        role: "dominant",
        surface: ".fg-story-brief",
        surfaceChapterId: "fg-research",
        job: "Turn the interview findings into one clear product brief without exposing the internal evidence taxonomy.",
        proves:
          "The project moved from a personal concern to a bounded problem, opportunity, and product goal informed by six interviews.",
        limitation:
          "The brief is qualitative and based on a small sample.",
      },
    ],
  },
  {
    chapterId: "fg-design",
    dominantClaim: {
      id: "fg-design-pivot",
      text: "Advisor feedback forced a pivot from a Google Maps add-on to a standalone route experience with inspectable conditions and a contextual daylight reminder.",
      class: "behavioral",
      state: "built",
    },
    interpretation:
      "The standalone product makes audience-specific context visible before route selection, while the reminder carries a useful daylight window beyond the open app.",
    caveat:
      "An explainable route preference and working reminder do not prove that the route is safer or that the driver changes behavior.",
    proofs: [
      {
        id: "fg-pivot-journey",
        label: "Google Maps add-on to standalone product",
        kind: "sequence",
        role: "dominant",
        surface: "PivotJourney",
        surfaceChapterId: "fg-design",
        job: "Show the failed direction, advisor feedback, and the route-preview redesign that followed.",
        proves:
          "The current prototype exposes alternative-route conditions, sources, and scoring cues before selection.",
        limitation:
          "The sequence demonstrates a design and implementation change, not real-world route quality.",
      },
      {
        id: "fg-departure-reminder",
        label: "Daylight departure reminder",
        kind: "working-product",
        role: "supporting",
        surface: "DepartureReminderEvidence",
        surfaceChapterId: "fg-design",
        job: "Show how interview stories about daylight became a permission-gated local reminder.",
        proves:
          "The prototype asks for notification access when the driver chooses Schedule and stores a reminder for the suggested departure.",
        limitation:
          "The reminder proves implemented behavior, not that a driver leaves at that time or has a safer trip.",
      },
    ],
  },
  {
    chapterId: "fg-pulled-over",
    dominantClaim: {
      id: "fg-pulled-over-stress-support",
      text: "The pulled-over flow reduces interaction demands and keeps ACLU-sourced guidance, recording, contacts, and offline help close.",
      class: "behavioral",
      state: "built",
    },
    interpretation:
      "The feature stays out of the way until requested, then prioritizes the few actions and words a driver may need during a high-stress moment.",
    caveat:
      "The flow has not been tested during a real police encounter and is not evidence of a better outcome.",
    proofs: [
      {
        id: "fg-pulled-over-journey",
        label: "Pulled-over support reconstruction",
        kind: "interactive",
        role: "dominant",
        surface: "PulledOverJourney",
        surfaceChapterId: "fg-pulled-over",
        job: "Demonstrate the one-thumb reveal and sequence of situational support.",
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
      text: "Community reports should stay specific, reviewable, and visibly uncertain instead of becoming official-looking safety facts.",
      class: "interpretive",
      state: "proposed",
    },
    interpretation:
      "The intended model preserves each account as one person's experience and gives corroborated reports more influence over time.",
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
      id: "fg-thesis-day-demo",
      text: "Classmates navigated the early Figma flows, and thesis-day participants entered their own addresses and generated Fresh Greens routes; intended-audience and real-driving validation remain.",
      class: "outcome",
      state: "needs-proof",
      reopenWhen:
        "Black drivers test route quality, trust, stress-state behavior, and failure modes across real trips and regions.",
    },
    interpretation:
      "The project has basic usability feedback and an end-to-end functional demonstration without claiming safety, trust, or behavioral efficacy.",
    caveat:
      "Classmates were not the intended audience, and a thesis-day demonstration is not evidence that Fresh Greens improves a real trip.",
    proofs: [
      {
        id: "fg-thesis-demo",
        label: "Thesis-day address-to-route demonstration",
        kind: "working-product",
        role: "dominant",
        surface: ".fg-thesis-demo",
        surfaceChapterId: "fg-scope",
        job: "Document that students could enter their own addresses and receive a Fresh Greens route with the daylight gradient.",
        proves:
          "The implemented product completed the basic address-to-route experience for people other than Myles.",
        limitation:
          "The demonstration did not validate route quality, cultural trust, safety, or repeat use.",
      },
      {
        id: "fg-validation-grid",
        label: "What was tested and what remains",
        kind: "scope-ledger",
        role: "supporting",
        surface: ".fg-validation-grid",
        surfaceChapterId: "fg-scope",
        job: "Keep basic usability and implementation evidence separate from the intended-audience testing still required.",
        proves:
          "The project has bounded evidence from interviews, classmate prototype sessions, and a working thesis-day demonstration.",
        limitation:
          "The ledger documents current evidence and gaps rather than independent outcome measurement.",
      },
    ],
  },
] as const satisfies readonly ProjectChapterEvidence[];
