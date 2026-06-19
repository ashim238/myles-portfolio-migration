"use client";

import { useId, useRef } from "react";
import type { ReactNode } from "react";

type Item = { id: string; label: string; content?: ReactNode };

export function Tabs({
  items,
  value,
  onChange,
}: {
  items: Item[];
  value: string;
  onChange: (id: string) => void;
}) {
  const baseId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasPanels = items.some((it) => it.content != null);

  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  }

  return (
    <>
      <div className="nv-tabs" role="tablist">
        {items.map((it, idx) => {
          const selected = it.id === value;
          return (
            <button
              key={it.id}
              ref={(el) => {
                refs.current[idx] = el;
              }}
              id={`${baseId}-tab-${it.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={it.content != null ? `${baseId}-panel-${it.id}` : undefined}
              tabIndex={selected ? 0 : -1}
              className={`nv-tab${selected ? " nv-tab--selected" : ""}`}
              onClick={() => onChange(it.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {it.label}
            </button>
          );
        })}
      </div>
      {hasPanels &&
        items
          .filter((it) => it.content != null)
          .map((it) => (
            <div
              key={it.id}
              id={`${baseId}-panel-${it.id}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${it.id}`}
              hidden={it.id !== value}
              className="nv-tabpanel"
            >
              {it.content}
            </div>
          ))}
    </>
  );
}
