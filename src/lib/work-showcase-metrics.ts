import type { Project } from "@/lib/content";

/** Lines cycled on the active work card's living metric slot. */
export function getProjectMetricPhrases(project: Project): string[] {
  const phrases: string[] = [];

  if (project.outcomeMetricValue && project.outcomeMetricLabel) {
    phrases.push(`${project.outcomeMetricValue} ${project.outcomeMetricLabel}`);
  }

  if (project.highlightQuote) {
    phrases.push(project.highlightQuote);
  }

  if (project.role) {
    phrases.push(project.role);
  }

  for (const tag of project.tags.slice(0, 2)) {
    phrases.push(tag);
  }

  if (project.timeframe) {
    phrases.push(project.timeframe);
  }

  return phrases;
}
