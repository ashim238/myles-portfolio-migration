import type { ProjectChapterEvidence } from "@/lib/project-evidence/types";

export const NAVI_EVIDENCE = [
  {
    chapterId: "nv-intro",
    dominantClaim: {
      id: "nv-intro-map-limit",
      text: "The first concept redistributed attention on a map without changing what visitors did after arrival.",
      class: "interpretive",
      state: "observed",
    },
    interpretation:
      "The heatmap made geographic redirection the outcome, so the next research needed to test a broader resident and stakeholder problem.",
    caveat:
      "The heatmap is an exploratory reconstruction, not live tourist-density evidence or proof of visitor behavior.",
    proofs: [
      {
        id: "nv-heatmap-explorer",
        label: "Exploratory Manhattan heatmap",
        kind: "interactive",
        role: "dominant",
        surface: "HeatmapExplorer",
        surfaceChapterId: "nv-intro",
        job: "Expose the behavior and limitation of the first concept.",
        proves:
          "The early artifact treated geographic redirection as the primary interaction and outcome.",
        limitation:
          "It contains no live density data and cannot show whether engagement changed after arrival.",
      },
    ],
  },
  {
    chapterId: "nv-insights",
    dominantClaim: {
      id: "nv-insights-research-redirect",
      text: "A 14-response resident and stakeholder survey, combined with a six-platform audit, redirected the brief toward overcrowding, authenticity, and trust at decision points.",
      class: "interpretive",
      state: "observed",
    },
    interpretation:
      "The research moved the concept beyond redistributing attention and toward helping people understand, compare, and commit with more context.",
    caveat:
      "The sample included 14 responses and two local businesses. It does not represent all New York City residents.",
    proofs: [
      {
        id: "nv-survey-stat-rings",
        label: "Survey concern counts",
        kind: "structured",
        role: "dominant",
        surface: "SurveyStatRings",
        surfaceChapterId: "nv-insights",
        job: "Make the two most frequent concerns and their denominators visible.",
        proves:
          "Ten of 14 responses named overcrowding and over-tourism, while seven of 14 named a lack of authentic experiences.",
        limitation:
          "The counts describe this small concept sample and do not establish population prevalence.",
      },
      {
        id: "nv-heuristic-insight-cards",
        label: "Travel-platform heuristic findings",
        kind: "structured",
        role: "supporting",
        surface: "HeuristicInsightCards",
        surfaceChapterId: "nv-insights",
        job: "Connect platform usability findings to trust and comparison decisions.",
        proves:
          "The audit surfaced label consistency, family-facing filter, and visual-clutter issues in the evaluated experience.",
        limitation:
          "A heuristic evaluation identifies likely usability issues but does not replace user testing.",
      },
    ],
  },
  {
    chapterId: "nv-framework",
    dominantClaim: {
      id: "nv-framework-learn-plan-go",
      text: "Research-informed archetypes, journeys, and booking steps translated the findings into Learn, Plan, Go.",
      class: "interpretive",
      state: "built",
    },
    interpretation:
      "Neighborhood context, comparison, and booking became one product model instead of separate research outputs.",
    caveat:
      "The archetypes and journeys are internal planning artifacts, not validated personas or tested end-to-end journeys.",
    proofs: [
      {
        id: "nv-research-artifacts",
        label: "Research and product-scope board",
        kind: "structured",
        role: "dominant",
        surface: "NaviResearchArtifacts",
        surfaceChapterId: "nv-framework",
        job: "Show how findings affected archetypes, journey needs, and booking decisions.",
        proves:
          "The planning artifacts connect named research sources to product areas and decision points.",
        limitation:
          "They document the design rationale but do not prove that the framework works for residents, travelers, or hosts.",
      },
    ],
  },
  {
    chapterId: "nv-build",
    dominantClaim: {
      id: "nv-build-working-system",
      text: "The later solo rebuild turned the studio concept into a working React component system and individual booking flow.",
      class: "behavioral",
      state: "built",
    },
    interpretation:
      "The rebuild made the product model inspectable as components, states, and a complete sample reservation path.",
    caveat:
      "A working browser flow proves implementation behavior, not usability, demand, or marketplace viability.",
    proofs: [
      {
        id: "nv-demo-embed",
        label: "Working Navi booking flow",
        kind: "working-product",
        role: "dominant",
        surface: "NaviDemoEmbed",
        surfaceChapterId: "nv-build",
        job: "Let readers inspect the current booking-flow behavior in the browser.",
        proves:
          "The current build supports feed browsing, neighborhood search, host viewing, and a sample individual reservation.",
        limitation:
          "The demo has not been validated with the audiences named in the case study.",
      },
      {
        id: "nv-composition-strip",
        label: "Component-system composition strip",
        kind: "structured",
        role: "supporting",
        surface: "CompositionStrip",
        surfaceChapterId: "nv-build",
        job: "Connect the product screens to the reusable visual and interaction system.",
        proves:
          "The working flow is assembled from an explicit set of component and token decisions.",
        limitation:
          "A system inventory does not show whether the resulting product is useful or understandable to users.",
      },
    ],
  },
  {
    chapterId: "nv-outcome",
    dominantClaim: {
      id: "nv-outcome-validation-boundary",
      text: "The browser product is inspectable now, while resident, traveler, and local-host validation remains outstanding.",
      class: "outcome",
      state: "needs-proof",
      reopenWhen:
        "The booking flow has been tested with residents, travelers, and local hosts and the findings are recorded.",
    },
    interpretation:
      "The case study can claim a working product and a clear next-research agenda without presenting the concept as settled.",
    caveat:
      "The scope ledger documents implementation status. It is not evidence of adoption, comprehension, or impact.",
    proofs: [
      {
        id: "nv-validation-ledger",
        label: "Working-now and next-research ledger",
        kind: "scope-ledger",
        role: "dominant",
        surface: ".nv-validation-ledger",
        surfaceChapterId: "nv-outcome",
        job: "Separate implemented capabilities from future research and group-booking scope.",
        proves:
          "The current build includes a live component system, neighborhood exploration, filters, and an individual booking flow.",
        limitation:
          "The ledger is authored scope documentation and cannot establish user outcomes.",
      },
    ],
  },
] as const satisfies readonly ProjectChapterEvidence[];
