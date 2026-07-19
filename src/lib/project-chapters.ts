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
    { id: "fg-problem", stage: "Frame", title: "Why time and distance were not enough" },
    { id: "fg-research", stage: "Research", title: "What interviews with Black drivers changed" },
    { id: "fg-design", stage: "Design", title: "Safer route decisions" },
    { id: "fg-refine", stage: "Refine", title: "The visual system after the routing pivot" },
    { id: "fg-trust", stage: "Trust", title: "Moderating community reports" },
    { id: "fg-scope", stage: "Validate", title: "What I built and what still needs proof" },
  ],
  navi: [
    { id: "nv-intro", stage: "Frame", title: "Concentrated tourism as a routing problem" },
    { id: "nv-insights", stage: "Research", title: "The resident survey redirected the concept" },
    { id: "nv-framework", stage: "Define", title: "Research shaped exploration and booking" },
    { id: "nv-build", stage: "Build", title: "From prototype to booking flow" },
    { id: "nv-outcome", stage: "Validate", title: "What I would test next" },
  ],
  tiktok: [
    { id: "tt-research", stage: "Research", title: "Fashion subcultures on TikTok" },
    { id: "tt-system", stage: "Define", title: "The fixed catalog structure" },
    { id: "tt-modular", stage: "Explore", title: "Templates as modular parts" },
    { id: "tt-templates", stage: "Build", title: "From sketches to layered files" },
    { id: "tt-outcome", stage: "Deliver", title: "What shipped from the launch batch" },
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
