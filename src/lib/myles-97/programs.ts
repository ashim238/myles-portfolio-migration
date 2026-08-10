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
  | "trini-roti";

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
    primaryEvidence: "built",
  },
  {
    id: "understandingfafsa",
    appName: "FAFSA Mail.app",
    applicationType: "Modular mail composer",
    primaryEvidence: "observed",
  },
  {
    id: "navi",
    appName: "Navi Places.exe",
    applicationType: "Place-discovery application",
    primaryEvidence: "built",
  },
  {
    id: "tiktok",
    appName: "TikTok Catalog.studio",
    applicationType: "Catalog-template studio",
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
  "trini-roti",
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
