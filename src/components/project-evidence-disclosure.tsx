import type { ReactNode } from "react";

export function ProjectEvidenceDisclosure({
  summary,
  children,
}: {
  summary: string;
  children: ReactNode;
}) {
  return (
    <details className="project-evidence-disclosure">
      <summary>
        <span>{summary}</span>
        <span className="project-evidence-disclosure-mark" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="project-evidence-disclosure-content">{children}</div>
    </details>
  );
}
