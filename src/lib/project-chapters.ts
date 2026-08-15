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
      title: "Car culture and South Jersey go hand in hand",
    },
    {
      id: "fg-research",
      stage: "Research",
      title: "What I heard from six Black drivers",
    },
    {
      id: "fg-design",
      stage: "Plan",
      title: "1. Compare route conditions before choosing",
    },
    {
      id: "fg-pulled-over",
      stage: "Respond",
      title: "2. Keep four support paths one tap away during a stressful moment",
    },
    {
      id: "fg-trust",
      stage: "Trust",
      title: "3. Show what influenced a route recommendation",
    },
    {
      id: "fg-scope",
      stage: "Validate",
      title: "What I built and what I still need to test",
    },
  ],
  navi: [
    {
      id: "nv-intro",
      stage: "Frame",
      title: "An early heatmap showed where to go",
    },
    {
      id: "nv-insights",
      stage: "Research",
      title: "People wanted to know what a neighborhood had to offer",
    },
    {
      id: "nv-framework",
      stage: "Define",
      title: "How Learn, Plan, Go addressed the research",
    },
    {
      id: "nv-build",
      stage: "Build",
      title: "I rebuilt the booking flow in React",
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
