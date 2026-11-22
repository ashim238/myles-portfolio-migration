import type { Project } from "@/lib/content";

export type FeaturedProjectId =
  | "fresh-greens"
  | "understandingfafsa"
  | "navi"
  | "tiktok";

export type ProjectProgramId = FeaturedProjectId | `study-${string}`;

export type SystemProgramId =
  | "welcome"
  | "selected-work"
  | "about"
  | "loose-parts"
  | "resume"
  | "display-properties"
  | "reminders"
  | "paint"
  | "now-playing";

export type ProgramId = ProjectProgramId | SystemProgramId;

export type EvidenceState =
  | "built"
  | "shipped"
  | "observed"
  | "proposed"
  | "needs-proof";

export type ProjectProgramBlueprint = {
  id: ProjectProgramId;
  appName: string;
  applicationType: string;
  cardSummary?: string;
  primaryEvidence?: EvidenceState;
};

export type ProgramDefinition = ProjectProgramBlueprint & {
  title: string;
  summary: string;
  href: `/work/${string}`;
  coverImage?: string;
  coverAlt?: string;
  previewImage?: Project["sections"][number]["images"][number];
};

export const FRESH_GREENS_ROLE = "Solo design + build";

export const PROJECT_PROGRAM_BLUEPRINTS = [
  {
    id: "fresh-greens",
    appName: "Fresh Greens.exe",
    applicationType: "Route-planning software",
    cardSummary: `Navigation for Black drivers · ${FRESH_GREENS_ROLE}`,
    primaryEvidence: "built",
  },
  {
    id: "navi",
    appName: "Navi Places.exe",
    applicationType: "Neighborhood discovery",
    cardSummary: "Neighborhood discovery · My system + React demo",
    primaryEvidence: "built",
  },
  {
    id: "understandingfafsa",
    appName: "FAFSA Mail.app",
    applicationType: "Newsletter templates",
    cardSummary: "Mailchimp kit · Founder edits weekly",
    primaryEvidence: "observed",
  },
  {
    id: "tiktok",
    appName: "TikTok Catalog.studio",
    applicationType: "Fashion ad templates",
    cardSummary: "3 fashion templates · Light Academia shipped",
    primaryEvidence: "shipped",
  },
] as const satisfies readonly ProjectProgramBlueprint[];

export const SYSTEM_PROGRAM_IDS = [
  "welcome",
  "selected-work",
  "about",
  "loose-parts",
  "resume",
  "display-properties",
  "reminders",
  "paint",
  "now-playing",
] as const satisfies readonly SystemProgramId[];

const PROGRAM_IDS = new Set<ProgramId>([
  ...PROJECT_PROGRAM_BLUEPRINTS.map(({ id }) => id),
  ...SYSTEM_PROGRAM_IDS,
]);

export function isFeaturedProject(id: string): id is FeaturedProjectId {
  return PROJECT_PROGRAM_BLUEPRINTS.some(project => project.id === id);
}

export function projectSlug(id: string) {
  return id.startsWith("study-") ? id.slice(6) : id;
}

export function isProjectProgramId(value: unknown): value is ProjectProgramId {
  return typeof value === "string" && (isFeaturedProject(value) || /^study-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value));
}

export function isProgramId(value: unknown): value is ProgramId {
  return typeof value === "string" && (PROGRAM_IDS.has(value as ProgramId) || isProjectProgramId(value));
}

function fallbackTitle(appName: string): string {
  return appName.replace(/\.(?:exe|app|studio)$/i, "");
}

export function buildProgramRegistry(
  projects: readonly Project[],
): ProgramDefinition[] {
  const bySlug = new Map(projects.map((project) => [project.slug, project]));

  const featured = PROJECT_PROGRAM_BLUEPRINTS.map((blueprint) => {
    const project = bySlug.get(blueprint.id);

    return {
      ...blueprint,
      title: project?.title ?? fallbackTitle(blueprint.appName),
      summary: project?.summary ?? blueprint.applicationType,
      href: `/work/${blueprint.id}` as const,
      ...(project?.coverImage ? { coverImage: project.coverImage } : {}),
    };
  });

  const additions: ProgramDefinition[] = projects
    .filter(project => project.status === "published" && !isFeaturedProject(project.slug))
    .map(project => ({
      id: `study-${project.slug}`,
      href: `/work/${project.slug}`,
      title: project.title,
      appName: project.title,
      applicationType: project.tags[0] || "Case study",
      cardSummary: project.role,
      summary: project.summary,
      coverImage: project.coverImage,
      coverAlt: project.coverAlt,
      previewImage: project.sections.find(section => section.images.length)?.images[0],
    }));
  return [...featured, ...additions].sort((a, b) =>
    (bySlug.get(projectSlug(a.id))?.order ?? Infinity) - (bySlug.get(projectSlug(b.id))?.order ?? Infinity));
}
