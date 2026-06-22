"use client";

import { useId, useRef } from "react";
import type { ReactNode } from "react";
import { PillRow } from "./PillRow";

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

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) {
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
      <PillRow
        role="tablist"
        className="nv-pill-row--tablist"
        items={items.map((it) => ({ id: it.id, label: it.label }))}
        activeId={value}
        onSelect={onChange}
        itemRef={(el, idx) => {
          refs.current[idx] = el;
        }}
        onItemKeyDown={handleKeyDown}
        extraAttrs={(it, selected) => ({
          id: `${baseId}-tab-${it.id}`,
          role: "tab",
          "aria-selected": selected ? "true" : "false",
          "aria-controls":
            items.find((x) => x.id === it.id)?.content != null
              ? `${baseId}-panel-${it.id}`
              : undefined,
          tabIndex: selected ? "0" : "-1",
        })}
      />
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
