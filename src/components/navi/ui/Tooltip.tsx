"use client";

import { useId, useState, cloneElement, isValidElement } from "react";
import type { ReactNode, ReactElement } from "react";

export function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);

  // Inject aria-describedby onto the trigger element so screen readers associate
  // the tooltip text with the interactive control directly.
  // Merge with any existing aria-describedby so we don't clobber it.
  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        "aria-describedby": [
          (children as ReactElement<Record<string, unknown>>).props["aria-describedby"],
          id,
        ]
          .filter(Boolean)
          .join(" ") || id,
      })
    : children;

  return (
    <span
      className="nv-tooltip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      {trigger}
      <span role="tooltip" id={id} className="nv-tooltip-bubble" hidden={!open}>
        {content}
      </span>
    </span>
  );
}
