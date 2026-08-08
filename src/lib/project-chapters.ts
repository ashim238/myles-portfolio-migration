export type ProjectChapterEntry = {
  readonly id: string;
  readonly stage: string;
  readonly title: string;
};

export type ProjectChapterVariant =
  | "fresh-greens"
  | "navi"
  | "tiktok"
  | "understandingfafsa";

export const CASE_STUDY_CHAPTERS = {
  "fresh-greens": [
    {
      id: "fg-problem",
      stage: "Background",
      title: "Why I started Fresh Greens",
    },
    {
      id: "fg-research",
      stage: "Research",
      title: "What six Black drivers were already doing",
    },
    {
      id: "fg-design",
      stage: "Pivot",
      title: "Why the Google Maps version failed",
    },
    {
      id: "fg-pulled-over",
      stage: "Respond",
      title: "A feature I hope no one needs",
    },
    {
      id: "fg-trust",
      stage: "Trust",
      title: "How community reports stay accountable",
    },
    {
      id: "fg-scope",
      stage: "Test",
      title: "What worked on thesis day and what still needs testing",
    },
  ],
  navi: [
    {
      id: "nv-intro",
      stage: "Frame",
      title: "The first idea moved visitors, not behavior",
    },
    {
      id: "nv-insights",
      stage: "Research",
      title: "The survey changed the brief",
    },
    {
      id: "nv-framework",
      stage: "Define",
      title: "From neighborhood context to Learn, Plan, Go",
    },
    {
      id: "nv-build",
      stage: "Build",
      title: "From studio concept to working booking flow",
    },
    {
      id: "nv-outcome",
      stage: "Validate",
      title: "What works now and what still needs testing",
    },
  ],
  tiktok: [
    {
      id: "tt-brief",
      stage: "Brief",
      title: "What Dynamic Showcase Ads needed",
    },
    {
      id: "tt-research",
      stage: "Choose",
      title: "Why three directions moved forward",
    },
    {
      id: "tt-system",
      stage: "Build",
      title: "One slot map, three visual systems",
    },
    {
      id: "tt-outcome",
      stage: "Deliver",
      title: "Why Light Academia shipped",
    },
  ],
  understandingfafsa: [
    { id: "uf-context", stage: "Frame", title: "A rebrand and a weekly workflow" },
    { id: "uf-audit", stage: "Research", title: "What 120 newsletters revealed" },
    { id: "uf-locked", stage: "Define", title: "Rules for fixed and swappable parts" },
    { id: "uf-figma", stage: "Build", title: "Rebuilding the system in Mailchimp" },
    { id: "uf-results", stage: "Measure", title: "The first redesigned send" },
  ],
} as const satisfies Record<
  ProjectChapterVariant,
  readonly ProjectChapterEntry[]
>;
