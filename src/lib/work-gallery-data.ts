import type { Project } from "@/lib/content";

/** The emphasized lead + muted remainder for a gallery card's outcome line. */
export function galleryOutcome(project: Project): { lead: string; rest: string } {
  const lead = project.outcomeLead ?? project.outcomeMetricValue ?? "";
  const rest =
    project.outcomeRest ??
    (project.outcomeMetricValue ? (project.outcomeMetricLabel ?? "") : project.summary);
  return { lead, rest };
}

/** The single mono meta line: role · year. */
export function galleryMeta(project: Project): string {
  return [project.role, project.timeframe].filter(Boolean).join(" · ");
}
