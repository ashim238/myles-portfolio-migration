"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Item = { id: string; title: string; content: ReactNode };

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="nv-accordion">
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id} className="nv-accordion-row">
            <button
              id={`nv-trigger-${it.id}`}
              type="button"
              className="nv-accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={`nv-acc-${it.id}`}
              onClick={() => setOpen(isOpen ? null : it.id)}
            >
              <span>{it.title}</span>
              <span className="nv-accordion-chevron" aria-hidden="true">
                {isOpen ? "▴" : "▾"}
              </span>
            </button>
            <div
              id={`nv-acc-${it.id}`}
              role="region"
              aria-labelledby={`nv-trigger-${it.id}`}
              hidden={!isOpen}
              className="nv-accordion-panel"
            >
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
