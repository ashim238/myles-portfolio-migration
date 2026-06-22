import type { ReactNode } from "react";
import Link from "next/link";

const ICON = (
  <span className="nv-impact-icon" aria-hidden="true">
    {/* leaf glyph */}
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M13 2C7 2 3 5 3 11c0 1 0 2 .5 3C5 11 8 9 12 8c-3 2-5 4-6 7 5 0 8-4 8-10 0-1 0-2-1-3z" />
    </svg>
  </span>
);

export function ImpactSignal({
  children,
  as: As = "span",
  href,
}: {
  children: ReactNode;
  as?: "span" | "div";
  href?: string;
}) {
  // When linked, it is announced as a link (its accessible name is the content),
  // so it must not also carry role="note". The unlinked variant keeps the note
  // semantics used across the rest of the site.
  if (href) {
    return (
      <Link href={href} className="nv-impact nv-impact--link">
        {ICON}
        <span className="nv-impact-text">{children}</span>
      </Link>
    );
  }
  return (
    <As className="nv-impact" role="note" aria-label="Regenerative impact">
      {ICON}
      <span className="nv-impact-text">{children}</span>
    </As>
  );
}
