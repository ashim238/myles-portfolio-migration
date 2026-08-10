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
      stage: "Frame",
      title: "Why route planning needs more than time and distance",
    },
    {
      id: "fg-research",
      stage: "Research",
      title: "Three problems the interviews made clear",
    },
    {
      id: "fg-design",
      stage: "Plan",
      title: "1. See what is on each route before choosing",
    },
    {
      id: "fg-pulled-over",
      stage: "Respond",
      title: "2. Handle unexpected problems without adding stress",
    },
    {
      id: "fg-trust",
      stage: "Trust",
      title: "3. Navigate with transparent community contributors",
    },
    {
      id: "fg-scope",
      stage: "Validate",
      title: "What the prototype made possible and what still needs proof",
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
      title: "From critique to the launch library",
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
