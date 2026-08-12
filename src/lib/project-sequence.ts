import type { Project } from "@/lib/content";

const PROJECT_SEQUENCE = {
  "fresh-greens": {
    nextSlug: "navi",
    bridge:
      "I also explored routing through neighborhood discovery and local booking.",
  },
  navi: {
    nextSlug: "understandingfafsa",
    bridge:
      "I turned an audit of 120 newsletter sends into a modular system a non-designer could run each week.",
  },
  understandingfafsa: {
    nextSlug: "tiktok",
    bridge:
      "At TikTok, I designed static catalog templates for different product categories, keeping the product slots fixed while the visual systems changed.",
  },
  tiktok: {
    nextSlug: "fresh-greens",
    bridge:
      "Fresh Greens is my most recent project: a route-planning prototype shaped by interviews with Black drivers.",
  },
} as const satisfies Record<string, { nextSlug: string; bridge: string }>;

export type ResolvedNextProject = {
  project: Project;
  bridge: string;
};

export function resolveNextProject(
  currentSlug: string,
  projects: readonly Project[],
): ResolvedNextProject | null {
  const route = PROJECT_SEQUENCE[currentSlug as keyof typeof PROJECT_SEQUENCE];
  if (!route) return null;

  const project = projects.find(
    (candidate) =>
      candidate.slug === route.nextSlug && candidate.status === "published",
  );

  return project ? { project, bridge: route.bridge } : null;
}
