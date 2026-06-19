import type { ReactNode } from "react";

export function ImpactSignal({
  children,
  as: As = "span",
}: {
  children: ReactNode;
  as?: "span" | "div";
}) {
  return (
    <As className="nv-impact" role="note" aria-label="Regenerative impact">
      <span className="nv-impact-icon" aria-hidden="true">
        {/* leaf glyph */}
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          <path d="M13 2C7 2 3 5 3 11c0 1 0 2 .5 3C5 11 8 9 12 8c-3 2-5 4-6 7 5 0 8-4 8-10 0-1 0-2-1-3z" />
        </svg>
      </span>
      <span className="nv-impact-text">{children}</span>
    </As>
  );
}
