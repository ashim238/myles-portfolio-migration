import type { Project } from "@/lib/content";

export type ProjectProgramId =
  | "fresh-greens"
  | "understandingfafsa"
  | "navi"
  | "tiktok";

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
  primaryEvidence: EvidenceState;
};

export type ProgramDefinition = ProjectProgramBlueprint & {
  title: string;
  summary: string;
  href: `/work/${string}`;
  coverImage?: string;
};

export const PROJECT_PROGRAM_BLUEPRINTS = [
  {
    id: "fresh-greens",
    appName: "Fresh Greens.exe",
    applicationType: "Route-planning software",
    cardSummary: "Navigation for Black drivers · Solo design + build",
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
    id: "navi",
    appName: "Navi Places.exe",
    applicationType: "Neighborhood discovery",
    cardSummary: "Neighborhood discovery · My system + React demo",
    primaryEvidence: "built",
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

export function isProgramId(value: unknown): value is ProgramId {
  return typeof value === "string" && PROGRAM_IDS.has(value as ProgramId);
}

function fallbackTitle(appName: string): string {
  return appName.replace(/\.(?:exe|app|studio)$/i, "");
}

export function buildProgramRegistry(
  projects: readonly Project[],
): ProgramDefinition[] {
  const bySlug = new Map(projects.map((project) => [project.slug, project]));

  return PROJECT_PROGRAM_BLUEPRINTS.map((blueprint) => {
    const project = bySlug.get(blueprint.id);

    return {
      ...blueprint,
      title: project?.title ?? fallbackTitle(blueprint.appName),
      summary: project?.summary ?? blueprint.applicationType,
      href: `/work/${blueprint.id}` as const,
      ...(project?.coverImage ? { coverImage: project.coverImage } : {}),
    };
  });
}
