"use client";

import { useRef } from "react";

type Item = { id: string; label: string };

export function Tabs({
  items,
  value,
  onChange,
}: {
  items: Item[];
  value: string;
  onChange: (id: string) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

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
    <div className="nv-tabs" role="tablist">
      {items.map((it, idx) => {
        const selected = it.id === value;
        return (
          <button
            key={it.id}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            role="tab"
            type="button"
            aria-selected={selected}
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
  );
}
